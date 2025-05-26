import { prisma } from "../../plugins/prisma";
import { InventoryQuery } from "../inventory/inventory.model";

export const bookingRepository = {
    create: async (
        user_id: string,
        inventory_id: string,
        quantity: number,
        booking_at: Date,
        plan_return_at: Date
    ) => {
        return await prisma.booking.create({
            data: {
                booking_at: booking_at,
                user_id: user_id,
                plan_return_at: plan_return_at,
                bookingInventory: {
                    create: {
                        inventory_id: inventory_id,
                        quantity: quantity,
                    },
                },
            },
        });
    },
    findMany: async (user_id: string, query: InventoryQuery) => {
        const whereCondition = {} as any;

        if (query.category_id) {
            whereCondition.category_id = query.category_id;
        }
        return await prisma.bookingInventory.findMany({
            where: {
                inventory: {
                    name: {
                        contains: query.keyword ?? "",
                        mode: "insensitive",
                    },
                    ...whereCondition,
                },
                booking: {
                    user_id: user_id,
                },
            },
            select: {
                quantity: true,
                booking: true,
                booking_id: true,
                inventory: true,
                inventory_id: true,
            },
        });
    },
    count: async (query: InventoryQuery, user_id: string) => {
        const whereCondition = {} as any;

        if (query.category_id) {
            whereCondition.category_id = query.category_id;
        }
        return await prisma.bookingInventory.count({
            where: {
                inventory: {
                    name: {
                        contains: query.keyword ?? "",
                        mode: "insensitive",
                    },
                    ...whereCondition,
                },
                booking: {
                    user_id: user_id,
                },
            },
        });
    },
};
