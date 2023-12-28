import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

// from domain/common
const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createSlug = (name: string) =>
  `${generateRandomString(6)}-${slugify(name, {
    lower: true,
  })}`;

const prisma = new PrismaClient();

export const run = async () => {
  const isForce = process.argv.includes("--force");
  const pages = await prisma.page.findMany();

  for (const page of pages) {
    if (!isForce && !!page.slug) {
      continue;
    }

    const newSlug = createSlug(page.name);

    console.log(`Updating slug for page ${page.id}: ${page.slug} -> ${newSlug}`);

    await prisma.page.update({
      where: {
        id: page.id,
      },
      data: {
        slug: newSlug,
      }
    });
  }
}

run();
