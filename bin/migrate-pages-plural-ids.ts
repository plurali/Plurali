import { OwnerType, Page, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fixPage = async (page: Page) => {
  if (page.ownerType === OwnerType.Member) {
    return fixMemberPage(page);
  }

  if (page.ownerType === OwnerType.System) {
    return fixSystemPage(page);
  }

  console.warn(`Unknown page ${page.id} with owner type ${page.ownerType}, skipping...`);
}

const fOwner = (page: Pick<Page, "ownerType" | "ownerId">) => {
  return `${page.ownerType}::${page.ownerId}`;
}

const fixMemberPage = async (page: Page) => {
  const memberPluralId = page.ownerId;

  const member = await prisma.member.findFirst({
    where: {
      pluralId: memberPluralId,
    }
  });

  if (!member) {
    console.warn(`Page ${page.id} with owner ${fOwner(page)} is abandoned, skipping...`);
    return;
  }

  console.log(`Replacing Page ${page.id} owner ${fOwner(page)} -> ${fOwner({ ownerType: OwnerType.Member, ownerId: member.id })}`)

  return await prisma.page.update({
    where: {
      id: page.id,
    },
    data: {
      ownerType: OwnerType.Member,
      ownerId: member.id,
    }
  })
}

const fixSystemPage = async (page: Page) => {
  const systemPluralId = page.ownerId;

  const system = await prisma.system.findFirst({
    where: {
      pluralId: systemPluralId,
    }
  });

  if (!system) {
    console.warn(`Page ${page.id} with owner ${fOwner(page)} is abandoned, skipping...`);
    return;
  }

  console.log(`Replacing Page ${page.id} owner ${fOwner(page)} -> ${fOwner({ ownerType: OwnerType.System, ownerId: system.id })}`)

  return await prisma.page.update({
    where: {
      id: page.id,
    },
    data: {
      ownerType: OwnerType.System,
      ownerId: system.id,
    }
  })
}

const run = async () => {
  const pages = await prisma.page.findMany();

  for (const page of pages) {
    fixPage(page);
  }
}

run();
