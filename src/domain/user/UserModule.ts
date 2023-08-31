import { Module } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { PrismaModule } from '@infra/prisma/PrismaModule';
import { UserService } from './UserService';
import { UserVerificationRepository } from './verification/UserVerificationRepository';

@Module({
  imports: [PrismaModule.forRoot(UserRepository, UserVerificationRepository)],
  providers: [UserService],
  exports: [PrismaModule, UserService],
})
export class UserModule { }
