import { InventoryCondition } from "@prisma/client";
import { prisma } from "../../plugins/prisma";
import { transformSortOrder } from "../../utils/global-type";
import { InventoryBody, InventoryQuery } from "./inventory.model";

export const inventoryRepository = {
    findMany: async (query: InventoryQuery) => {
        const whereCondition = {
            is_deleted: false,
            name: {
                contains: query.keyword,
                mode: "insensitive",
            },
        } as any;

        if (query.condition) {
            whereCondition.condition = query.condition;
        }

        if (query.category_id) {
            whereCondition.category_id = query.category_id;
        }

        return await prisma.inventory.findMany({
            select: {
                id: true,
                name: true,
                condition: true,
                image_url: true,
                category_id: true,
                quantity: true,
                createdBy: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                created_at: true,
                is_available: true,
                inventoryCategory: {
                    select: {
                        name: true,
                    },
                },
            },
            where: whereCondition,
            orderBy: [
                {
                    created_at: transformSortOrder(query.order_by),
                },
            ],
            take: query.limit,
            skip: (query.page - 1) * query.limit,
        });
    },
    findById: async (id: string) => {
        return await prisma.inventory.findFirst({
            where: {
                id,
                is_deleted: false,
            },
            select: {
                id: true,
                createdBy: true,
                name: true,
                condition: true,
                image_url: true,
                is_available: true,
                quantity: true,
                inventoryCategory: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    },
    create: async (body: InventoryBody, userId: string) => {
        return await prisma.inventory.create({
            data: {
                name: body.name,
                condition: InventoryCondition.NEW,
                created_by: userId,
                image_url: body.image_url,
                is_available: body.is_available,
                category_id: body.category_id,
                quantity: body.quantity,

                // inventoryItems: {
                //     createMany: {
                //         data: Array.from({ length: body.quantity }, () => ({
                //             created_at: new Date(),
                //         })),
                //     },
                // },
            },
            select: {
                id: true,
                name: true,
            },
        });
    },
    update: async (id: string, body: InventoryBody, user_id: string) => {
        return await prisma.inventory.update({
            where: {
                id,
                created_by: user_id,
            },
            data: {
                name: body.name,
                // condition: body.condition,
                image_url: body.image_url,
                is_available: body.is_available,
                updated_by: user_id,
                category_id: body.category_id,
                quantity: body.quantity,
            },
            select: {
                id: true,
                name: true,
            },
        });
    },
    delete: async (id: string, user_id: string) => {
        return await prisma.inventory.update({
            where: {
                id: id,
                is_deleted: false,
            },
            data: {
                is_deleted: true,
                deleted_at: new Date().toISOString(),
                deleted_by: user_id,
            },
        });
    },
    count: async (query: InventoryQuery) => {
        const whereCondition = {
            is_deleted: false,
            name: {
                contains: query.keyword,
                mode: "insensitive",
            },
        } as any;

        if (query.condition) {
            whereCondition.condition = query.condition;
        }

        if (query.category_id) {
            whereCondition.category_id = query.category_id;
        }
        return await prisma.inventory.count({
            where: whereCondition,
        });
    },
};
