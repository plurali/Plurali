import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User, UserVerificationType } from '@prisma/client';
import { UserVerificationRepository } from './verification/UserVerificationRepository';
import { render } from '@react-email/render';
import { UserVerificationEmail } from '@domain/emails/UserVerificationEmail';
import { UserPasswordResetEmail } from '@domain/emails/UserPasswordResetEmail';
import { getFormattedTimeWithUnit } from '@domain/common/time';

@Injectable()
export class UserService {
  private static readonly PASSWORD_RESET_VALIDITY = 300;

  constructor(
    private readonly mailer: MailerService,
    private readonly verifications: UserVerificationRepository,
  ) {}

  public async sendVerificationEmail(user: User, _email?: string): Promise<void> {
    const email = _email ?? user.email;

    if (!email) {
      return;
    }

    await this.verifications.deleteMany({
      where: {
        type: UserVerificationType.Email,
        userId: user.id,
      },
    });

    const verification = await this.verifications.create({
      data: {
        type: UserVerificationType.Email,
        userId: user.id,
      },
    });

    await this.mailer.sendMail({
      to: `${user.username} <${email}>`,
      subject: 'Verify your Plurali account',
      html: render(
        UserVerificationEmail({
          link: `https://plurali.icu/user/verify-email/${verification.id}`, // TODO: domain as param
          username: user.username,
        }),
      ),
    });
  }

  public async sendPasswordResetEmail(
    user: User,
    _email?: string | null,
    expiry = UserService.PASSWORD_RESET_VALIDITY,
  ): Promise<void> {
    const email = _email ?? user.email;

    if (!email) {
      return;
    }

    await this.verifications.deleteMany({
      where: {
        type: UserVerificationType.PasswordReset,
        userId: user.id,
      },
    });

    const verification = await this.verifications.create({
      data: {
        type: UserVerificationType.PasswordReset,
        userId: user.id,
        expiresAt: new Date(Date.now() + expiry),
      },
    });

    await this.mailer.sendMail({
      to: `${user.username} <${email}>`,
      subject: 'Plurali Password Reset',
      html: render(
        UserPasswordResetEmail({
          link: `https://plurali.icu/auth/reset-password/${verification.id}?email=${email}`, // TODO: domain as param
          username: user.username,
          expiry: getFormattedTimeWithUnit(expiry),
        }),
      ),
    });
  }
}
