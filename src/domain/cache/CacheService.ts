import { createSlug } from "@domain/common";
import { SystemWithUser } from "@domain/common/types";
import { PluralRestService } from "@domain/plural/PluralRestService";
import { PluralFieldEntry } from "@domain/plural/types/rest/fields";
import { PluralMemberEntry } from "@domain/plural/types/rest/members";
import { PluralUserEntry, UserCustomField } from "@domain/plural/types/rest/user";
import { isPublicVisibility, parseFieldType, parseVisibility, PluralVisibility } from "@domain/plural/utils";
import { CacheRepository } from "@infra/cache/CacheRepository";
import { CacheNamespace } from "@infra/cache/utils";
import { PrismaTx } from "@infra/prisma/types";
import { ConsoleLogger, Inject, Injectable } from "@nestjs/common";
import { Field, Member, Prisma, System, User, Visibility } from "@prisma/client";
import { captureException } from "@sentry/node";
import { PrismaService } from "nestjs-prisma";

const txConfig = {
  maxWait: 50000000,
  timeout: 50000000,
};

@Injectable()
export class CacheService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: CacheRepository,
    private readonly logger: ConsoleLogger,
    @Inject("PluralRestServiceBase") private readonly plural: PluralRestService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async rebuildMembers(system: SystemWithUser, tx: PrismaTx = this.prisma) {
    const pluralMembers = await this.plural.findMembers(system);

    // Delete all members that are not listed by SP anymore
    await tx.member.deleteMany({
      where: {
        pluralId: {
          notIn: pluralMembers.map((member) => member.id),
        },
        systemId: system.id,
      },
    });

    const members = [];

    for (const plural of pluralMembers) {
      members.push(await this.rebuildMember(system, plural, tx));
    }

    return members;
  }

  async rebuildMember(system: System, plural: PluralMemberEntry, tx: PrismaTx = this.prisma) {
    const visible = parseVisibility(plural.content) === PluralVisibility.Public;

    this.logger.log(`Rebuilding (s:${system.id}) ${system.pluralId}/m/${plural.id}`);

    let member = await tx.member.findFirst({
      where: {
        pluralId: plural.id,
        systemId: system.id,
      },
    });

    if (!member) {
      member = await tx.member.create({
        data: {
          pluralId: plural.id,
          pluralParentId: system.pluralId,
          systemId: system.id,
          slug: createSlug(plural.content.name),
          visibility: visible ? Visibility.Public : Visibility.Private,
        },
      });
    } else {
      member = await tx.member.update({
        where: {
          id: member.id,
        },
        data: {
          pluralParentId: system.pluralId,
        },
      });
    }

    return member;
  }

  // TECHDEBT: Simplify this once Simply Plural fully removes legacy fields
  async rebuildFields(
    system: System,
    plural: PluralUserEntry,
    pluralFields: PluralFieldEntry[],
    tx: PrismaTx = this.prisma,
  ) {
    for (const legacyFieldId of Object.keys(plural.content.fields ?? {})) {
      const dbLegacyField = await tx.field.findUnique({
        where: {
          pluralId: legacyFieldId,
        },
      });

      if (!dbLegacyField) {
        continue;
      }

      const newFieldId = pluralFields.find((f) => f.content.oid === legacyFieldId)?.id;

      if (!newFieldId && dbLegacyField.isLegacyField) {
        continue;
      }

      this.logger.log(`Found legacy field ${legacyFieldId} of ${newFieldId} for system ${plural.id}`);

      await tx.field.update({
        where: {
          id: dbLegacyField.id,
        },
        data: {
          ...(newFieldId ? { pluralId: newFieldId } : {}),
          isLegacyField: !newFieldId,
        },
      });
    }

    // List of the legacy fields which have not yet been migrated
    const legacyFieldsToKeep = Object.keys(plural.content.fields ?? {}).filter(
      (originalId) => !pluralFields.some((newField) => newField.content.oid === originalId),
    );

    const allFieldIds = [
      ...legacyFieldsToKeep.map((id) => ({ id, isLegacy: true })),
      ...pluralFields.map((field) => ({ id: field.id, isLegacy: false })),
    ];

    // Delete all fields that are not listed by SP anymore
    await tx.field.deleteMany({
      where: {
        pluralId: {
          notIn: allFieldIds.map(({ id }) => id),
        },
        systemId: system.id,
      },
    });

    if (!allFieldIds.length) {
      this.logger.log(`No fields to rebuild for system ${system.pluralId}`);
      return [];
    }

    const fields: Field[] = [];

    for (const { id: pluralId, isLegacy } of allFieldIds) {
      const content = isLegacy
        ? plural.content.fields?.[pluralId]
        : pluralFields.find((f) => f.id === pluralId)?.content;

      if (!content) {
        this.logger.warn(`No content found for field ${pluralId}/legacy:${isLegacy} in system ${system.pluralId}`);
        continue;
      }

      this.logger.log(`Rebuilding (s:${system.id}) ${system.pluralId}/f/${pluralId}/legacy:${isLegacy}`);

      const data = {
        name: content.name,
        type: parseFieldType(content),
        isLegacyField: isLegacy,
      } satisfies Partial<Prisma.FieldCreateInput>;

      let dbField = await tx.field.findFirst({
        where: {
          systemId: system.id,
          pluralId,
        },
      });

      if (!dbField) {
        dbField = await tx.field.create({
          data: {
            ...data,
            pluralId,
            pluralParentId: plural.id,
            systemId: system.id,
            // New fields are private by default as the visibility is set by buckets
            visibility: isLegacy
              ? isPublicVisibility(content as UserCustomField)
                ? Visibility.Public
                : Visibility.Private
              : Visibility.Private,
          },
        });
      } else {
        dbField = await tx.field.update({
          where: {
            id: dbField.id,
          },
          data,
        });
      }

      fields.push(dbField);
    }

    return fields;
  }

  async rebuildFor(user: User & { system?: System }, useTransacction = false): Promise<void> {
    this.logger.log(`Rebuilding cache for ${user.id}`);
    let pluralUser: PluralUserEntry | null = null;
    if (user.pluralAccessToken) {
      try {
        pluralUser = await this.plural.findUserForId("me", user.pluralAccessToken);
      } catch (error) {
        captureException(error);
        this.logger.error(`Failed to get data for ${user.id}`, error);
      }
    }

    if (!pluralUser?.content?.isAsystem) {
      pluralUser = null;
    }

    if (!pluralUser) {
      await this.prisma.system.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          pluralOverride: null,
          pluralAccessToken: null,
        },
      });

      return;
    }

    if (!user.system) {
      // Attempt to fetch system if not passed
      user.system = await this.prisma.system.findUnique({
        where: {
          userId: user.id,
        },
      });
    }

    if (user.system) {
      await this.clearSystem(user.system);

      if (user.system.pluralId !== pluralUser.id) {
        await this.prisma.system.delete({
          where: {
            id: user.system.id,
          },
        });

        await this.prisma.member.deleteMany({
          where: {
            systemId: user.system.id,
          },
        });

        await this.prisma.field.deleteMany({
          where: {
            systemId: user.system.id,
          },
        });
      }
    }

    user = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        system: {
          upsert: {
            update: {},
            create: {
              slug: createSlug(pluralUser.content.username),
              pluralId: pluralUser.id,
              visibility: Visibility.Private,
            },
          },
        },
      },
      include: {
        system: true,
      },
    });

    const pluralFields = await this.plural.findFieldsForId(pluralUser.id, user.pluralAccessToken);

    if (useTransacction) {
      await this.prisma.$transaction(
        async (tx) => await this.rebuildMembers(Object.assign(user.system, { user }), tx),
        txConfig,
      );
      await this.prisma.$transaction(
        async (tx) => await this.rebuildFields(user.system, pluralUser, pluralFields, tx),
        txConfig,
      );
    } else {
      await this.rebuildMembers(Object.assign(user.system, { user }));
      await this.rebuildFields(user.system, pluralUser, pluralFields);
    }
  }

  async rebuild(useTransaction = false): Promise<void> {
    this.logger.log("Starting a cache rebuild job");
    const users = await this.prisma.user.findMany({
      include: {
        system: {
          include: {
            members: true,
            fields: true,
            user: true,
          },
        },
      },
    });

    for (const user of users) {
      await this.rebuildFor(user, useTransaction);
    }
    this.logger.log("Cache rebuild job complete");
  }

  static createSystemKey(system: System) {
    return CacheRepository.createKey(CacheNamespace.System, `SystemSID${system.pluralId}`);
  }

  static createMemberListKey(system: System) {
    return CacheRepository.createKey(CacheNamespace.MemberList, `SystemSID${system.pluralId}`);
  }

  static createMemberKey(member: Member) {
    return CacheRepository.createKey(
      CacheNamespace.Member,
      `SystemSID${member.pluralParentId}_MemberSID${member.pluralId}`,
    );
  }

  async clearSystem(system: System): Promise<void> {
    const keys = await this.repository.keys(`*SystemSID${system.pluralId}*`);
    await this.repository.cache.mdel(keys);
  }

  async clearMemberList(system: System): Promise<void> {
    await this.repository.delete(CacheNamespace.MemberList, `SystemSID${system.pluralId}`);
  }

  async clearMember(member: Member): Promise<void> {
    await this.repository.delete(
      CacheNamespace.Member,
      `SystemSID${member.pluralParentId}_MemberSID${member.pluralId}`,
    );
  }

  async clearUser(user: User & { system?: System }): Promise<void> {
    const system =
      user.system ??
      (await this.prisma.system.findFirst({
        where: {
          userId: user.id,
        },
      }));

    if (system) {
      await this.clearSystem(system);
    }
  }
}
