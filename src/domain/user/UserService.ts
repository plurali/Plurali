import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private readonly mailer: MailerService
    ) {}

    public async sendVerificationEmail(user: User, email?: string): Promise<void> {
        if (!user.email && !email) {
            return;
        }

        await this.mailer.sendMail({
            to: email ?? user.email,
            subject: "Verify your Plurali account",
            template: "verification",
            context: {
                link: "",
            }
        })
    }
}