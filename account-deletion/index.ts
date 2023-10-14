import { OwnerType, PrismaClient, System, User } from "@prisma/client";
import { config } from "dotenv";
import { join } from "path";
import {prompt} from "inquirer"
import {ObjectId} from "bson";

config({ path: join(__dirname, "..", ".env") })

const db = new PrismaClient();

type IdType = "system" | "user";

interface DeletionInquiry {
    type: IdType;
    value: string;
}

// TODO: refactor to use the nest container and it's services
// TODO: cdn cleanup

const deleteUser = async (userId: string | null) => {
    let user: User | null = null;

    if (userId) {
        user = await db.user.delete({
            where: {
                id: userId
            }
        })
    }

    console.log(user ? "Deleted associated user" : "Could not find user for this system");
}

const deleteBySystem = async (systemOrPluralId: string | System) => {
    let system: System | null = null;
    
    if (typeof systemOrPluralId === "string") {
        system = await db.system.findFirst({
            where: {
                pluralId: systemOrPluralId
            }
        });
    }

    if (!system) {
        console.log("Cannot find system");
    }

    const systemId = typeof systemOrPluralId === "string" ? systemOrPluralId : system?.pluralId; 

    if (!systemId) {
        console.log("System id is required");
        return;
    }

    const members = await db.member.findMany({
        where: {
            pluralParentId: systemId
        }
    });

    for (const member of members) {
        const {count: memberPageCount} = await db.page.deleteMany({
            where: {
                ownerType: OwnerType.Member,
                ownerId: member.pluralId
            }
        })

        console.log(`Deleted ${memberPageCount} pages for member ${member.id}`);
        
        await db.member.delete({
            where: {
                id: member.id
            }
        });

        console.log(`Deleted member ${member.id}`);
    }

    const {count: pageCount} = await db.page.deleteMany({
        where: { 
            ownerType: OwnerType.System,
            ownerId: systemId,
        }
    })

    console.log(`Deleted ${pageCount} system pages`);

    const {count: fieldCount} = await db.field.deleteMany({
        where: { 
            pluralParentId: systemId,
        }
    })

    console.log(`Deleted ${fieldCount} fields`);

    deleteUser(system?.userId ?? null);

    await db.system.deleteMany({
        where: {
            pluralId: systemId
        },
    })

    console.log(`System with plural id ${systemId} deleted`)
}

const run = async () => {
    const { type, value } = await prompt<DeletionInquiry>([
        {
            type: "list",
            name: "type",
            choices: ["system", "user"] satisfies IdType[],
            message: "System/User ID?"
        },
        {
            type: "input",
            name: "value",
            message: "Enter the ID",
            validate(value, {type}: Omit<DeletionInquiry, "input">) {
                return type === "user" ? ObjectId.isValid(value) : true;
            }
        }
    ]);

    if (type === "system") {
       await deleteBySystem(value);
    } else {
        const user = await db.user.findUnique({
            where: {
                id: value
            }
        });

        if (!user) {
            console.log("Cannot find user");
            return;
        }

        const system = await db.system.findUnique({
            where: {
                userId: user.id
            }
        });

        if (!system) {
            console.log("This user does not have an associated system");
            await deleteUser(user.id);
            return;
        }

        await deleteBySystem(system);
    }
}

run()