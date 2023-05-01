import { PrismaRepository } from "@infra/prisma/PrismaRepository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class FieldRepository extends PrismaRepository<"field"> {
    constructor(prisma: PrismaService) {
        super("field", prisma)
    }    
}