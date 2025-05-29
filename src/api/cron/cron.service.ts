import { Request, Response } from "express";
import { prisma } from "../../plugins/prisma";
import { BookingStatus, InventoryCondition } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { success } from "../../response/success";

export const cronService = {
    overdueBooking: async (req: Request, res: Response) => {
        console.log("[Cron] Checking overdue bookings...");

        const overdueBookings = await prisma.booking.findMany({
            where: {
                is_done: false,
                is_returned: false,
                is_approved: true,
                plan_return_at: {
                    lt: new Date(),
                },
            },
        });

        console.log(`[Cron] Found ${overdueBookings.length} overdue bookings.`);

        if (overdueBookings.length > 0) {
            console.log("push notification");
        }
        res.status(StatusCodes.OK).json(success("Success", null));
    },
    overdueApproval: async (req: Request, res: Response) => {
        console.log("[Cron] Checking overdue approval");

        const overdueBookings = await prisma.booking.findMany({
            where: {
                is_done: false,
                is_returned: false,
                is_approved: false,
                is_rejected: false,
                plan_return_at: {
                    lt: new Date(),
                },
            },
        });

        console.log(`[Cron] Found ${overdueBookings.length} overdue approval.`);

        if (overdueBookings.length > 0) {
            const ids = overdueBookings.map((d) => d.id);
            await prisma.booking.updateMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
                data: {
                    is_rejected: true,
                    is_done: true,
                    reject_reason: "[AUTOMATIC] Approver does not respond",
                    rejected_at: new Date(),
                    status: BookingStatus.REJECTED,
                },
            });

            await prisma.inventory.updateMany({
                where: {
                    id: {
                        in: overdueBookings.map((d) => d.inventory_id),
                    },
                },
                data: {
                    condition: InventoryCondition.GOOD,
                },
            });

            console.log(
                `[Cron] booking id ${ids.join(
                    ","
                )} has automatically rejected by system.`
            );
        }
        res.status(StatusCodes.OK).json(success("Success", null));
    },
};
