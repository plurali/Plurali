import { PrismaClient } from "@prisma/client";
import { PrismaModelName } from "../src/infrastructure/prisma/types";
import { prompt } from "inquirer";
import { ObjectId } from "bson";
import { htmlToSlateTree } from "@plurali/editor";

const prisma = new PrismaClient();

export const models = ["system", "member", "page", "notification"] satisfies PrismaModelName[];

export interface ConvertInquiry {
    modelName: PrismaModelName;
    id: string;
}

export type ContentModel = {
    id: string;
    content?: string;
    description?: string;
};

export type PrismaFindFnArgs = {
    where: {
        id
    }
}

export type PrismaFindFn = (args: PrismaFindFnArgs) => Promise<ContentModel | null>;

export const run = async () => {
    const { modelName, id } = await prompt<ConvertInquiry>([
        {
            type: "list",
            name: "modelName",
            choices: models,
            message: "Which model?"
        },
        {
            type: "input",
            name: "id",
            message: "ID?",
            validate: (val) => ObjectId.isValid(val)
        }
    ]);

    const find = <PrismaFindFn>(prisma[modelName].findFirst as unknown);

    const model = await find({
        where: {
            id
        }
    });

    if (!model) {
        console.log("not found");
        return
    }

    const html = model.content ?? model.description;

    if (!html) {
        console.log("has no content");
        return;
    }

    console.dir(htmlToSlateTree(html), { depth: null });
}

run();