import { PrismaClient } from "@prisma/client";
import { seedAdmin } from "./admin.seed";

const prisma = new PrismaClient();

async function seed() {
    await seedAdmin(prisma);
}

seed().then(() => {
    console.log("ALL SEEDING DONE");
});
