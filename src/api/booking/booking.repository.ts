import { prisma } from "../../plugins/prisma";
import { transformSortOrder } from "../../utils/global-type";
import { InventoryQuery } from "../inventory/inventory.model";

export const bookingRepository = {
    create: async (
        user_id: string,
        booking_at: Date,
        plan_return_at: Date,
        inventory_id: string
    ) => {
        return await prisma.booking.create({
            data: {
                booking_at: booking_at,
                user_id: user_id,
                plan_return_at: plan_return_at,
                inventory_id,
            },
        });
    },
    findMany: async (user_id: string, query: InventoryQuery) => {
        const whereCondition = {} as any;

        if (query.category_id) {
            whereCondition.category_id = query.category_id;
        }
        if (query.user_id) {
            whereCondition.user_id = query.user_id;
        }

        return await prisma.booking.findMany({
            where: {
                inventory: {
                    name: {
                        contains: query.keyword ?? "",
                        mode: "insensitive",
                    },
                    ...whereCondition,
                },
            },
            select: {
                id: true,
                inventory_id: true,
                user_id: true,
                booking_at: true,
                plan_return_at: true,
                returned_at: true,
                rejected_at: true,
                approved_at: true,
                reject_reason: true,
                inventory: {
                    select: {
                        name: true,
                        inventoryCategory: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                rejected_by: true,
                approved_by: true,
                is_approved: true,
                is_rejected: true,
                is_done: true,
                is_returned: true,
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
    findManySelf: async (user_id: string, query: InventoryQuery) => {
        const whereCondition = {} as any;

        if (query.category_id) {
            whereCondition.category_id = query.category_id;
        }
        return await prisma.booking.findMany({
            where: {
                inventory: {
                    name: {
                        contains: query.keyword ?? "",
                        mode: "insensitive",
                    },
                    ...whereCondition,
                },
                user_id,
            },
            select: {
                id: true,
                inventory_id: true,
                user_id: true,
                booking_at: true,
                plan_return_at: true,
                rejected_at: true,
                returned_at: true,
                approved_at: true,
                reject_reason: true,
                inventory: {
                    select: {
                        name: true,
                        inventoryCategory: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                rejected_by: true,
                approved_by: true,
                is_approved: true,
                is_rejected: true,
                is_done: true,
                is_returned: true,
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
    count: async (query: InventoryQuery, user_id: string) => {
        const whereCondition = {} as any;

        if (query.category_id) {
            whereCondition.category_id = query.category_id;
        }
        return await prisma.booking.count({
            where: {
                inventory: {
                    name: {
                        contains: query.keyword ?? "",
                        mode: "insensitive",
                    },
                    ...whereCondition,
                },
            },
        });
    },
    countSelf: async (query: InventoryQuery, user_id: string) => {
        const whereCondition = {} as any;

        if (query.category_id) {
            whereCondition.category_id = query.category_id;
        }
        return await prisma.booking.count({
            where: {
                inventory: {
                    name: {
                        contains: query.keyword ?? "",
                        mode: "insensitive",
                    },
                    ...whereCondition,
                },
                user_id,
            },
        });
    },
};
