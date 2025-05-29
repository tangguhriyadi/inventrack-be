import cron from "node-cron";
import { prisma } from "../plugins/prisma";
import { ActionLog } from "@prisma/client";
import { NotificationService } from "../utils/pusher";

export const scheduleOverdueBookingChecker = () => {
    cron.schedule("* * * * *", async () => {
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
    });
};
