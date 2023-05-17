import { Module } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { PrismaModule } from '@infra/prisma/PrismaModule';

@Module({
  imports: [PrismaModule.forRoot(UserRepository)],
  exports: [PrismaModule],
})
export class UserModule {}
