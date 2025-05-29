import { Response } from "express";
import {
    bookingBody,
    bookingParams,
    bookingQuery,
    BookingRequest,
    rejectBody,
    RejectRequest,
} from "./booking.model";
import { inventoryRepository } from "../inventory/inventory.repository";
import { HttpException } from "../../response/exception";
import { prisma } from "../../plugins/prisma";
import { StatusCodes } from "http-status-codes";
import { success } from "../../response/success";
import { bookingRepository } from "./booking.repository";
import { Pagination } from "../../utils/global-type";
import {
    ActionLog,
    BookingStatus,
    InventoryCondition,
    Role,
} from "@prisma/client";
import { insertLog } from "../../utils/insert-log";

export const bookingService = {
    book: async (req: BookingRequest, res: Response) => {
        req.body = bookingBody.validateSync(req.body, { abortEarly: false });

        // CHECK AVAILABILITY
        const inventory = await inventoryRepository.findById(
            req.body.inventory_id
        );

        if (!inventory) {
            throw new HttpException("Inventory not found", 404);
        }

        if (inventory.condition === InventoryCondition.WORN) {
            throw new HttpException("Inventory is booked by someone", 404);
        }

        if (!inventory.is_available) {
            throw new HttpException("Inventory is not available", 404);
        }

        // CHECK STOCK AVAILABILITY
        if (inventory.quantity <= 0) {
            throw new HttpException("Insufficient inventory", 400);
        }

        // CHECK CURRENT BOOKING
        const bookings = await prisma.booking.findMany({
            where: {
                inventory: {
                    name: {
                        contains: req.query.keyword ?? "",
                        mode: "insensitive",
                    },
                },
                inventory_id: req.body.inventory_id,
                user_id: req.user.id,
                is_done: false,
            },
        });

        if (bookings.length > 0) {
            throw new HttpException("You have booked this item", 400);
        }

        const bookNow = await bookingRepository.create(
            req.user.id,
            req.body.booking_at,
            req.body.plan_return_at,
            req.body.inventory_id
        );

        await prisma.inventory.update({
            where: {
                id: req.body.inventory_id,
            },
            data: {
                condition: InventoryCondition.WORN,
            },
        });

        await prisma.notification.create({
            data: {
                action: ActionLog.BOOK,
                user_id: inventory.createdBy.id,
                inventory_id: req.body.inventory_id,
                message: `New book for '${inventory.name}' by ${req.user.name}`,
                is_read: false,
                booking_id: bookNow.id,
            },
        });

        await insertLog({
            action: ActionLog.BOOK,
            user_id: req.user.id,
            user_name: req.user.name,
            inventory_id: req.body.inventory_id,
            inventory_name: inventory.name,
        });

        res.status(StatusCodes.OK).json(success("Success", null));
    },
    findMany: async (req: BookingRequest, res: Response) => {
        req.query = bookingQuery.validateSync(req.query, { abortEarly: false });

        let bookings;
        let totalCount: number;

        if (req.user.role === Role.ADMIN) {
            bookings = await bookingRepository.findMany(req.user.id, req.query);
            totalCount = await bookingRepository.count(req.query, req.user.id);
        } else {
            bookings = await bookingRepository.findManySelf(
                req.user.id,
                req.query
            );
            totalCount = await bookingRepository.countSelf(
                req.query,
                req.user.id
            );
        }

        const totalPage = Math.ceil(totalCount / req.query.limit);

        const pagination: Pagination = {
            page: req.query.page,
            total_page: totalPage,
            total_data: totalCount,
            data_in_page: bookings.length,
        };

        res.status(StatusCodes.OK).json(
            success("Success", bookings, pagination)
        );
    },
    approve: async (req: BookingRequest, res: Response) => {
        req.params = bookingParams.validateSync(req.params, {
            abortEarly: false,
        });

        const booking = await prisma.booking.findFirst({
            where: {
                id: req.params.id,
            },
            include: {
                inventory: true,
            },
        });

        if (!booking) {
            throw new HttpException("Booking not found", 404);
        }

        if (booking.is_done) {
            throw new HttpException("Booking has already closed", 400);
        }

        if (booking.is_approved) {
            throw new HttpException("Booking has already approved", 400);
        }

        if (booking.is_returned) {
            throw new HttpException("Booking has already returned", 400);
        }

        if (booking.is_rejected) {
            throw new HttpException("Booking has already rejected", 400);
        }

        await prisma.booking.update({
            where: {
                id: req.params.id,
            },
            data: {
                is_approved: true,
                approved_by: req.user.id,
                approved_at: new Date(),
                status: BookingStatus.APPROVED,
            },
        });

        await prisma.inventory.update({
            where: {
                id: booking.inventory.id,
            },
            data: {
                condition: InventoryCondition.WORN,
            },
        });

        await prisma.notification.create({
            data: {
                action: ActionLog.APPROVE,
                user_id: booking.user_id,
                inventory_id: booking.inventory_id,
                booking_id: booking.id,
                message: `Your booking for ${booking.inventory.name} has been approved`,
                is_read: false,
            },
        });

        await insertLog({
            action: ActionLog.APPROVE,
            user_id: booking.user_id,
            user_name: req.user.name,
            inventory_id: booking.inventory_id,
            inventory_name: booking.inventory.name,
        });

        res.status(StatusCodes.OK).json(success("Success", null));
    },
    return: async (req: BookingRequest, res: Response) => {
        req.params = bookingParams.validateSync(req.params, {
            abortEarly: false,
        });

        const booking = await prisma.booking.findFirst({
            where: {
                id: req.params.id,
                user_id: req.user.id,
            },
            include: {
                inventory: true,
            },
        });

        if (!booking) {
            throw new HttpException("Booking not found", 404);
        }

        if (booking.is_done) {
            throw new HttpException("Booking has already closed", 400);
        }

        if (booking.is_returned) {
            throw new HttpException("Booking has already returned", 400);
        }

        if (booking.is_rejected) {
            throw new HttpException("Booking has already rejected", 400);
        }

        await prisma.booking.update({
            where: {
                id: req.params.id,
            },
            data: {
                is_returned: true,
                returned_at: new Date(),
                is_done: true,
                status: BookingStatus.RETURNED,
            },
        });

        await prisma.inventory.update({
            where: {
                id: booking.inventory.id,
            },
            data: {
                condition: InventoryCondition.GOOD,
            },
        });

        await prisma.notification.create({
            data: {
                action: ActionLog.RETURN,
                user_id: booking.inventory.created_by,
                inventory_id: booking.inventory_id,
                booking_id: booking.id,
                message: `You inventory '${booking.inventory.name}' has been returned`,
                is_read: false,
            },
        });

        await insertLog({
            action: ActionLog.RETURN,
            user_id: req.user.id,
            user_name: req.user.name,
            inventory_id: req.body.inventory_id,
            inventory_name: booking.inventory.name,
        });

        res.status(StatusCodes.OK).json(success("Success", null));
    },
    reject: async (req: RejectRequest, res: Response) => {
        req.params = bookingParams.validateSync(req.params, {
            abortEarly: false,
        });

        req.body = rejectBody.validateSync(req.body, { abortEarly: false });

        const booking = await prisma.booking.findFirst({
            where: {
                id: req.params.id,
                // user_id: req.user.id,
            },
            include: {
                inventory: true,
            },
        });

        if (!booking) {
            throw new HttpException("Booking not found", 404);
        }

        if (booking.is_done) {
            throw new HttpException("Booking has already closed", 400);
        }

        if (booking.is_approved) {
            throw new HttpException("Booking has already approved", 400);
        }

        if (booking.is_returned) {
            throw new HttpException("Booking has already returned", 400);
        }

        if (booking.is_rejected) {
            throw new HttpException("Booking has already rejected", 400);
        }

        await prisma.booking.update({
            where: {
                id: req.params.id,
            },
            data: {
                is_rejected: true,
                rejected_at: new Date(),
                is_done: true,
                reject_reason: req.body.reason,
                rejected_by: req.user.id,
                status: BookingStatus.REJECTED,
            },
        });

        await prisma.inventory.update({
            where: {
                id: booking.inventory_id,
            },
            data: {
                condition: InventoryCondition.GOOD,
            },
        });

        await prisma.notification.create({
            data: {
                action: ActionLog.REJECT,
                user_id: booking.user_id,
                inventory_id: booking.inventory_id,
                booking_id: booking.id,
                message: `You booking for '${booking.inventory.name}' has been rejected`,
                is_read: false,
            },
        });

        await insertLog({
            action: ActionLog.REJECT,
            user_id: req.user.id,
            user_name: req.user.name,
            inventory_id: booking.inventory_id,
            inventory_name: booking.inventory.name,
        });

        res.status(StatusCodes.OK).json(success("Success", null));
    },
};
