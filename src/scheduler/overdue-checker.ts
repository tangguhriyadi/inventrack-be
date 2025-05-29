import cron from "node-cron";
import { prisma } from "../plugins/prisma";

export const scheduleOverdueBookingChecker = () => {
    cron.schedule("* * * * *", async () => {
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
            
        }
    });
};
