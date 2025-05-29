import { Request, Response } from "express";
import { prisma } from "../../plugins/prisma";
import { ActionLog, BookingStatus, InventoryCondition } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { success } from "../../response/success";
import { NotificationService } from "../../utils/pusher";

export const cronService = {
    overdueBooking: async (req: Request, res: Response) => {
        console.log("[Cron] Checking overdue bookings...");

        const overdueBookings = await prisma.booking.findMany({
            where: {
                is_done: false,
                is_returned: false,
                is_approved: true,
                is_remind: false,
                plan_return_at: {
                    lt: new Date(),
                },
            },
            include: {
                inventory: true,
            },
        });

        console.log(`[Cron] Found ${overdueBookings.length} overdue bookings.`);

        if (overdueBookings.length > 0) {
            console.log("push notification");
            await prisma.notification.createMany({
                data: overdueBookings.map((d) => ({
                    action: ActionLog.REJECT,
                    user_id: d.user_id,
                    inventory_id: d.inventory_id,
                    booking_id: d.id,
                    message: `Your booking for '${d.inventory.name}' is overdue ! , please return it ASAP `,
                    is_read: false,
                })),
            });

            await prisma.booking.updateMany({
                where: {
                    id: {
                        in: overdueBookings.map((d) => d.id),
                    },
                },
                data: {
                    is_remind: true,
                },
            });

            overdueBookings.forEach(async (d) => {
                NotificationService.info(
                    "Overdue !",
                    `Your booking for '${d.inventory.name}' is overdue ! , please return it ASAP `,
                    d.user_id
                );
            });
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
            include: {
                inventory: true,
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

            await prisma.notification.createMany({
                data: overdueBookings.map((d) => ({
                    action: ActionLog.REJECT,
                    user_id: d.user_id,
                    inventory_id: d.inventory_id,
                    booking_id: d.id,
                    message: `Your booking for '${d.inventory.name}' has been rejected automatically due to no respond from Admin`,
                    is_read: false,
                })),
            });

            overdueBookings.forEach(async (d) => {
                NotificationService.info(
                    "No response from approver",
                    `Your booking for ${d.inventory.name} has been rejected automatically due to no respond from Admin`,
                    d.user_id
                );
            });

            console.log(
                `[Cron] booking for ${overdueBookings
                    .map((d) => d.inventory.name)
                    .join(",")} has automatically rejected by system.`
            );
        }
        res.status(StatusCodes.OK).json(success("Success", null));
    },
};
