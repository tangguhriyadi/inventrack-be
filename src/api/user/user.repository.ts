import { prisma } from "../../plugins/prisma";
import {
    UserBodySchema,
    UserCreateBodySchema,
    UserQueryParams,
} from "./user.model";

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
    findMany: async (query: UserQueryParams) => {
        const whereCondition: any = {
            is_deleted: false,
            name: {
                contains: query.keyword,
                mode: "insensitive",
            },
        };

        if (query.role) {
            whereCondition.role = query.role;
        }

        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                gender: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
            where: whereCondition,
            take: query.limit,
            skip: (query.page - 1) * query.limit,
        });
    },
    create: async (body: UserCreateBodySchema) => {
        return prisma.user.create({
            data: {
                email: body.email,
                name: body.name,
                role: body.role,
                password: body.password,
                gender: body.gender,
            },
        });
    },
    update: async (id: string, body: UserBodySchema) => {
        return prisma.user.update({
            where: {
                id: id,
            },
            data: {
                name: body.name,
                role: body.role,
                gender: body.gender,
            },
        });
    },
    delete: async (id: string) => {
        return prisma.user.update({
            where: {
                id: id,
            },
            data: {
                is_deleted: true,
                deleted_at: new Date(),
            },
        });
    },
    findById: (id: string) => {
        return prisma.user.findFirst({
            where: {
                id: id,
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
    count: async (query: UserQueryParams) => {
        const whereCondition: any = {
            is_deleted: false,
            name: {
                contains: query.keyword,
                mode: "insensitive",
            },
        };

        if (query.role) {
            whereCondition.role = query.role;
        }

        return prisma.user.count({
            where: whereCondition,
        });
    },
};
