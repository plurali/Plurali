import { Module } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { PrismaModule } from '@infra/prisma/PrismaModule';
import { UserService } from './UserService';

@Module({
  imports: [PrismaModule.forRoot(UserRepository)],
  providers: [UserService],
  exports: [PrismaModule, UserService],
})
export class UserModule { }
