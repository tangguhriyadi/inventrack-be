import cron from "node-cron";
import { prisma } from "../plugins/prisma";
import { BookingStatus } from "@prisma/client";

export const automaticReject = () => {
    cron.schedule("* * * * *", async () => {
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
            const ids = overdueBookings.map((d) => d.id)
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

            console.log(`[Cron] booking id ${ids.join(",")} has automatically rejected by system.`)
        }
    });
};
