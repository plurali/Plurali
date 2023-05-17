import { DynamicModule, ExistingProvider, Inject, InjectionToken, Module, Provider } from '@nestjs/common';
import { PrismaModule as BasePrismaModule, PrismaService } from 'nestjs-prisma';
import { PrismaRepository } from './PrismaRepository';
import { ForModuleCustomEntry, ForModuleEntry, PrismaModelName, PrismaRepositoryType } from './types';

@Module({
  imports: [BasePrismaModule],
})
export class PrismaModule {
  public static forRoot<N extends PrismaModelName>(
    ...entries: (ForModuleEntry<N> | ForModuleEntry<N>[])[]
  ): DynamicModule {
    const providers = (Array.isArray(entries[0]) ? entries[0] : entries).map(provider => {
      if (typeof provider === 'string') {
        return this.createRepositoryProvider(provider);
      }

      if (Array.isArray(provider)) {
        throw new Error('Cannot pass multiple arrays in PrismaModule.forRoot()');
      }

      return this.createCustomRepositoryProvider(provider);
    });
    return {
      module: PrismaModule,
      providers: providers,
      exports: providers,
    };
  }

  public static createRepositoryProvider<N extends PrismaModelName>(modelName: N): Provider<PrismaRepositoryType<N>> {
    return {
      provide: this.createRepositoryProviderName(modelName),
      useFactory: (prisma: PrismaService) => new PrismaRepository(modelName, prisma),
    };
  }

  public static createCustomRepositoryProvider<N extends PrismaModelName>(
    entry: ForModuleCustomEntry<N>
  ): Provider<typeof entry extends ExistingProvider<infer T> ? T : PrismaRepositoryType<N>> {
    if (typeof entry === 'function') {
      return {
        provide: entry,
        useClass: entry,
      };
    }

    const provide: InjectionToken = !('provide' in entry)
      ? this.createRepositoryProviderName(entry.modelName)
      : entry.provide;

    return {
      ...entry,
      provide,
    };
  }

  public static createRepositoryProviderName<N extends PrismaModelName>(modelName: N): `PrismaRepository__${N}` {
    return `PrismaRepository__${modelName}`;
  }
}

// Only used when basic PrismaRepository is needed or when the repository entry is passed as ExistingProvider<Repository>/Type<Repository>
export function InjectRepository<N extends PrismaModelName>(modelName: N) {
  return Inject(PrismaModule.createRepositoryProviderName<N>(modelName));
}
