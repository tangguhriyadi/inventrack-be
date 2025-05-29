import { Response } from "express";
import { dashboardQuery, DashboardRequest } from "./dashboard.model";
import { prisma } from "../../plugins/prisma";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { success } from "../../response/success";

export const dashboardService = {
    mostBooked: async (req: DashboardRequest, res: Response) => {
        req.query = dashboardQuery.validateSync(req.query, {
            abortEarly: false,
        });

        let raw;

        if (req.query.start_date && req.query.end_date) {
            raw = Prisma.sql`
        SELECT 
          i.name AS inventory_name,
          COUNT(b.id) AS count
        FROM booking b
        JOIN inventory i ON i.id = b.inventory_id
        WHERE b.booking_at BETWEEN ${req.query.start_date} AND ${req.query.end_date}
        GROUP BY i.id, i.name
        ORDER BY count DESC
        LIMIT 10
      `;
        } else {
            raw = Prisma.sql`
        SELECT 
          i.name AS inventory_name,
          COUNT(b.id) AS count
        FROM booking b
        JOIN inventory i ON i.id = b.inventory_id
        GROUP BY i.id, i.name
        ORDER BY count DESC
        LIMIT 10
      `;
        }

        const result = await prisma.$queryRaw<
            { inventory_name: string; count: number }[]
        >(raw);

        // Convert BigInt to number
        const parsed = result.map((item) => ({
            inventory_name: item.inventory_name,
            count: Number(item.count),
        }));

        res.status(StatusCodes.OK).json(success("Success", parsed));
    },
    byCategory: async (req: DashboardRequest, res: Response) => {
        req.query = dashboardQuery.validateSync(req.query, {
            abortEarly: false,
        });

        let raw;

        if (req.query.start_date && req.query.end_date) {
            raw = Prisma.sql`
        -- SELECT 
        SELECT 
        ic.name AS category_name,
        COUNT(b.id) AS count
        FROM booking b
        JOIN inventory i ON i.id = b.inventory_id
        JOIN inventory_category ic ON ic.id = i.category_id
        WHERE b.booking_at BETWEEN ${req.query.start_date} AND ${req.query.end_date}
        GROUP BY ic.id, ic.name
        ORDER BY count DESC
      `;
        } else {
            raw = Prisma.sql`
        SELECT 
        ic.name AS category_name,
        COUNT(b.id) AS count
        FROM booking b
        JOIN inventory i ON i.id = b.inventory_id
        JOIN inventory_category ic ON ic.id = i.category_id
        GROUP BY ic.id, ic.name
        ORDER BY count DESC
      `;
        }

        const result = await prisma.$queryRaw<
            { category_name: string; count: number }[]
        >(raw);

        // Convert BigInt to number
        const parsed = result.map((item) => ({
            category_name: item.category_name,
            count: Number(item.count),
        }));

        res.status(StatusCodes.OK).json(success("Success", parsed));
    },
    overdue: async (req: DashboardRequest, res: Response) => {
        const data = await prisma.booking.findMany({
            where: {
                is_approved: true,
                is_done: false,
                is_returned: false,
                is_rejected: false,
                plan_return_at: {
                    lt: new Date(), // `lt` means "less than"
                },
            },
        });
        res.status(StatusCodes.OK).json(success("Success", data));
    },
    byStatus: async (req: DashboardRequest, res: Response) => {
        req.query = dashboardQuery.validateSync(req.query, {
            abortEarly: false,
        });

        let raw;

        if (req.query.start_date && req.query.end_date) {
            raw = Prisma.sql`
        SELECT 
        status,
        COUNT(*) AS count
        FROM booking b
        where b.user_id = ${req.user.id}
        AND b.booking_at BETWEEN ${req.query.start_date} AND ${req.query.end_date}
        GROUP BY status
      `;
        } else {
            raw = Prisma.sql`
        SELECT 
        status,
        COUNT(*) AS count
        FROM booking b
        where b.user_id = ${req.user.id}
        GROUP BY status
      `;
        }

        const result = await prisma.$queryRaw<
            { status: string; count: number }[]
        >(raw);

        // Convert BigInt to number
        const parsed = result.map((item) => ({
            status: item.status,
            count: Number(item.count),
        }));

        res.status(StatusCodes.OK).json(success("Success", parsed));
    },
};
