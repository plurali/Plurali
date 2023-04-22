import { PrismaClient, PrismaPromise, User, UserField, UserMember } from '@prisma/client';
import { $db } from '.';
import { AsyncArray } from '../../utils/array';
import { $server } from '../../server';

export type PrismaTx = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;

/**
 * This is mainly for the future when the schemas may change.
 */
export const ensureSchemaIntegrity = async () => {
  $server.log.info('[db-schema] ensuring schema integrity, this may take a while...');
  await $db.$transaction(async tx => {
    await AsyncArray.map(await $db.user.findMany(), async u => await ensureUserSchema(u, tx));
    await AsyncArray.map(await $db.userMember.findMany(), async m => await ensureUserMemberSchema(m, tx));
    await AsyncArray.map(await $db.userField.findMany(), async f => await ensureUserFieldSchema(f, tx));
  });
};

export const ensureUserSchema = async (user: User, tx: PrismaTx): Promise<User> => {
  // ...
  return user;
};

export const ensureUserMemberSchema = async (userMember: UserMember, tx: PrismaTx): Promise<UserMember> => {
  // ...
  return userMember;
};

export const ensureUserFieldSchema = async (userField: UserField, tx: PrismaTx): Promise<UserField> => {
  // ...
  return userField;
};
