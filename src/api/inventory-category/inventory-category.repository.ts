import { prisma } from "../../plugins/prisma";
import { QueryParams, transformSortOrder } from "../../utils/global-type";
import { InventoryCategoryBody } from "./inventory-category.model";

export const inventoryCategoryRepository = {
    findMany: async (query: QueryParams) => {
        return await prisma.inventoryCategory.findMany({
            select: {
                id: true,
                name: true,
            },
            where: {
                is_deleted: false,
                name: {
                    contains: query.keyword,
                    mode: "insensitive",
                },
            },
            orderBy: [
                {
                    created_at: transformSortOrder(query.sort_added),
                },
            ],
            take: query.limit,
            skip: (query.page - 1) * query.limit,
        });
    },
    findById: async (id: string) => {
        return await prisma.inventoryCategory.findFirst({
            select: {
                id: true,
                name: true,
            },
            where: {
                id: id,
                is_deleted: false,
            },
        });
    },
    create: async (body: InventoryCategoryBody, user_id: string) => {
        return await prisma.inventoryCategory.create({
            data: {
                name: body.name,
                created_by: user_id,
            },
            select: {
                id: true,
                name: true,
            },
        });
    },
    update: async (
        id: string,
        body: InventoryCategoryBody,
        user_id: string
    ) => {
        return await prisma.inventoryCategory.update({
            where: {
                id: id,
                is_deleted: false,
            },
            data: {
                name: body.name,
                updated_by: user_id,
            },
            select: {
                id: true,
            },
        });
    },
    delete: async (id: string, user_id: string) => {
        return await prisma.inventoryCategory.update({
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
    count: async (keyword?: string) => {
        return await prisma.inventoryCategory.count({
            where: {
                is_deleted: false,
                name: {
                    contains: keyword ?? "",
                    mode: "insensitive",
                },
            },
        });
    },
};
