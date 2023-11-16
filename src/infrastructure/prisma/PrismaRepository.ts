import { PrismaClient } from '@prisma/client';
import { PrismaDelegate, PrismaModelName, PrismaRepositoryType } from './types';

class _PrismaRepository<N extends PrismaModelName = PrismaModelName> {
  constructor(
    public readonly modelName: N,
    public readonly prisma: PrismaClient,
  ) {
    return new Proxy(this as unknown as PrismaRepositoryType<N>, {
      get(target, prop: keyof PrismaRepositoryType<PrismaModelName>) {
        if (prop in target) {
          return target[prop];
        } else if (prop in target.prisma[target.modelName]) {
          return (
            target.prisma[target.modelName][
              prop
            ] as PrismaDelegate<PrismaModelName>[keyof PrismaDelegate<PrismaModelName>] as any
          ).bind(target.prisma); // TODO: remove any
        }
      },
    });
  }
}

// ts cast
export const PrismaRepository: {
  new <N extends PrismaModelName>(modelName: N, prisma: PrismaClient): PrismaRepositoryType<N>;
} = _PrismaRepository as any;
