import { PrismaClient, Role } from "@prisma/client";

import bcrypt from "bcrypt";

export async function seedAdmin(prisma: PrismaClient): Promise<string> {
    const admin = await prisma.user.findFirst({
        where: {
            role: Role.ADMIN,
        },
    });

    if (!admin) {
        const hashedPassword = await bcrypt.hash("Admin123!", 10);
        const user = await prisma.user.create({
            data: {
                name: "Admin",
                password: hashedPassword,
                email: "admin@admin.com",
                role: Role.ADMIN,
                gender: "MALE",
            },
        });

        console.log("admin seeded");
        return user.id;
    } else {
        console.log("admin has already seeded");
        return admin.id;
    }
}
