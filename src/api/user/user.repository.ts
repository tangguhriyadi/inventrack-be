import { prisma } from "../../plugins/prisma";

export const userRepository = {
    findByEmail: (email: string) => {
        return prisma.user.findFirst({
            where: {
                email: email,
                is_deleted: false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                gender: true,
                role: true,
            },
        });
    },
};
