import { User } from '@prisma/client';
import { $redis, CacheStore, createKey } from './index.js';
import { Member, System } from '@plurali/common/dist/system/index.js';
import { ChainableCommander } from 'ioredis';

export const clearCacheByUser = async (user: string | User, transaction?: ChainableCommander) => {
  const id = typeof user === 'string' ? user : user.id;
  const keys = await $redis.keys(`*PluraliUser${id}*`);

  const t = transaction ?? $redis.multi();

  for (const key of keys) {
    t.del(key);
  }

  if (!transaction) {
    await t.exec();
  }
};

export const clearMemberListCache = async (system: System | string, transaction?: ChainableCommander) => {
  const id = system instanceof System ? system.id : system;

  const keys = await $redis.keys(createKey(CacheStore.MemberList, `*OwnerSID${id}*`));

  const t = transaction ?? $redis.multi();

  for (const key of keys) {
    t.del(key);
  }

  if (!transaction) {
    await t.exec();
  }
};

export const clearMemberCache = async (
  system: System | string,
  member: Member | string,
  transaction?: ChainableCommander
) => {
  const systemId = system instanceof System ? system.id : system;
  const memberId = member instanceof Member ? member.id : member;

  const keys = await $redis.keys(createKey(CacheStore.Member, `*OwnerSID${systemId}_MemberSID${memberId}*`));

  const t = transaction ?? $redis.multi();

  for (const key of keys) {
    t.del(key);
  }

  if (!transaction) {
    await t.exec();
  }
};
