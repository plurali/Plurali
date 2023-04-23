import { Background, PrismaClient, User, UserField, UserMember } from '@prisma/client';
import { $db } from './index.js';
import { AsyncArray } from '../../utils/array.js';
import { $server } from '../../server/index.js';

export type PrismaTx = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;

/**
 * This is mainly for the future when the schemas may change.
 */
export const ensureSchemaIntegrity = async () => {
  $server.log.info('[db-schema] ensuring schema integrity, this may take a while...');
  await $db.$transaction(async tx => {
    await ensureUserMemberSchema(tx);
    await AsyncArray.map(await $db.user.findMany(), u => ensureUserSchema(u, tx));
    await AsyncArray.map(await $db.userField.findMany(), f => ensureUserFieldSchema(f, tx));
  });
};

export const ensureUserSchema = async (user: User, tx: PrismaTx): Promise<User> => {
  // ...
  return user;
};

export const ensureUserMemberSchema = async (tx: PrismaTx): Promise<void> => {
  await tx.userMember.updateMany({
    where: {
      backgroundColor: {
        isSet: false
      }
    },
    data: {
      backgroundType: Background.Color,
    },
  });
};

export const ensureUserFieldSchema = async (userField: UserField, tx: PrismaTx): Promise<UserField> => {
  // ...
  return userField;
};
