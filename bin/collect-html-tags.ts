import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { join } from "path";
import { load } from "cheerio"

config({ path: join(__dirname, "..", ".env") })

const db = new PrismaClient();

// as we're migrating away from TinyMCE, this little script
// goes through all descriptions to parse what tags are used in the descriptions
// and will need to be migrated
const collectDescriptions = async () => {
    const systems = (await db.system.findMany({
        select: {
            description: true
        },
        where: {
            NOT: {
                description: null
            }
        }
    }))
        .map((s) => s.description)
        .filter(d => !!d) as string[];

    const members = (await db.member.findMany({
        select: {
            description: true
        },
        where: {
            NOT: {
                description: null
            }
        }
    }))
        .map((s) => s.description)
        .filter(d => !!d) as string[];

    const pages = (await db.page.findMany({
        select: {
            content: true
        },
    })).map((s) => s.content);

    return ([] as string[]).concat(systems, members, pages);
}

const parseTags = (html: string): string[] => {
    const $ = load(html);

    return $("*")
        .toArray()
        .map((el) => (el.parent as any).name)
        .filter((v: string | undefined) => !!v);
}

const run = async () => {
    let tags = [] as string[];

    for (const description of await collectDescriptions()) {
        tags = tags.concat(parseTags(description));
    }

    const uniqueTags = new Set(tags);

    console.log(uniqueTags)

    return uniqueTags;
}

run();