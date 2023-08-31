import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User, UserVerificationType } from "@prisma/client";
import { UserVerificationRepository } from "./verification/UserVerificationRepository";

@Injectable()
export class UserService {
    constructor(
        private readonly mailer: MailerService,
        private readonly verifications: UserVerificationRepository,
    ) {}

    public async sendVerificationEmail(user: User, email?: string): Promise<void> {
        if (!user.email && !email) {
            return;
        }

        await this.verifications.deleteMany({
            where: {
                type: UserVerificationType.Email,
                userId: user.id,
            }
        })

        const verification = await this.verifications.create({
            data: {
                type: UserVerificationType.Email,
                userId: user.id,
            }
        })

        await this.mailer.sendMail({
            to: email ?? user.email,
            subject: "Verify your Plurali account",
            template: "verification",
            context: {
                link: `https://plurali.icu/user/verify-email/${verification.id}`, // TODO: domain as param
            }
        })
    }
}