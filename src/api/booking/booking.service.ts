import { Response } from "express";
import {
    bookingBody,
    bookingParams,
    bookingQuery,
    BookingRequest,
} from "./booking.model";
import { inventoryRepository } from "../inventory/inventory.repository";
import { HttpException } from "../../response/exception";
import { prisma } from "../../plugins/prisma";
import { StatusCodes } from "http-status-codes";
import { success } from "../../response/success";
import { bookingRepository } from "./booking.repository";
import { Pagination } from "../../utils/global-type";
import { InventoryCondition } from "@prisma/client";

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

        if (!inventory.is_available) {
            throw new HttpException("Inventory is not available", 404);
        }
        // CHECK STOCK AVAILABILITY
        if (req.body.quantity > inventory.quantity) {
            throw new HttpException("Insufficient inventory", 400);
        }

        // CHECK CURRENT BOOKING
        const bookingInventory = await prisma.bookingInventory.findMany({
            where: {
                inventory_id: req.body.inventory_id,
                booking: {
                    OR: [
                        {
                            return_at: null,
                        },
                        {
                            approved_at: null,
                        },
                    ],
                },
            },
        });
        const currentBookingCount = bookingInventory.reduce(
            (acc, curr) => acc + curr.quantity,
            0
        );
        const availableQuantity = inventory.quantity - currentBookingCount;
        if (req.body.quantity > availableQuantity) {
            throw new HttpException(
                `The available quantity is ${availableQuantity}`,
                400
            );
        }

        await bookingRepository.create(
            req.user.id,
            req.body.inventory_id,
            req.body.quantity,
            req.body.booking_at,
            req.body.plan_return_at
        );

        res.status(StatusCodes.OK).json(success("Success", null));
    },
    findMany: async (req: BookingRequest, res: Response) => {
        req.query = bookingQuery.validateSync(req.query, { abortEarly: false });

        const bookings = await bookingRepository.findMany(
            req.user.id,
            req.query
        );

        const checkStatus = (
            return_at: Date | null,
            approved_at: Date | null
        ) => {
            if (!return_at && !approved_at) {
                return "PENDING";
            }

            if (approved_at && !return_at) {
                return "BOOKED";
            }

            if (approved_at && return_at) {
                return "RETURNED";
            }
        };

        const bookingResponse = bookings.map((booking) => ({
            id: booking.booking_id,
            inventory: booking.inventory.name,
            quantity: booking.quantity,
            status: checkStatus(
                booking.booking.return_at,
                booking.booking.approved_at
            ),
            is_overdue: booking.booking.plan_return_at < new Date(),
            return_at: booking.booking.return_at,
            approved_at: booking.booking.approved_at,
            booking_at: booking.booking.booking_at,
            plan_return_at: booking.booking.plan_return_at,
        }));

        // PAGINATION
        const totalCount = await bookingRepository.count(
            req.query,
            req.user.id
        );
        const totalPage = Math.ceil(totalCount / req.query.limit);

        const pagination: Pagination = {
            page: req.query.page,
            total_page: totalPage,
            total_data: totalCount,
            data_in_page: bookings.length,
        };

        res.status(StatusCodes.OK).json(
            success("Success", bookingResponse, pagination)
        );
    },
    approve: async (req: BookingRequest, res: Response) => {
        req.params = bookingParams.validateSync(req.params, {
            abortEarly: false,
        });

        const booking = await prisma.booking.findFirst({
            where: {
                id: req.params.id,
                user_id: req.user.id,
            },
        });

        if (!booking) {
            throw new HttpException("Booking not found", 404);
        }

        if (booking.approved_at) {
            throw new HttpException("Booking has already approved", 400);
        }

        await prisma.booking.update({
            where: {
                id: req.params.id,
            },
            data: {
                approved_at: new Date(),
            },
        });

        const inventory = await inventoryRepository.findById(
            req.body.inventory_id
        );
        if (!inventory) {
            throw new HttpException("Inventory not found", 404);
        }

        const bookingInventory = await prisma.bookingInventory.findMany({
            where: {
                inventory_id: req.body.inventory_id,
                booking: {
                    OR: [
                        {
                            return_at: null,
                        },
                        {
                            approved_at: null,
                        },
                    ],
                },
            },
        });

        const currentBookingCount = bookingInventory.reduce(
            (acc, curr) => acc + curr.quantity,
            0
        );
        const availableQuantity = inventory.quantity - currentBookingCount;
        if (req.body.quantity > availableQuantity) {
            throw new HttpException(
                `The available quantity is ${availableQuantity}`,
                400
            );
        }

        // ASYNC PROCESS
        if (availableQuantity === req.body.quantity) {
            await prisma.inventory.update({
                where: {
                    id: req.body.inventory_id,
                },
                data: {
                    is_available: false,
                    condition: InventoryCondition.WORN,
                },
            });
        }

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
            select: {
                id: true,
                bookingInventory: true,
                approved_at: true,
                return_at: true,
            }
        });

        if (!booking) {
            throw new HttpException("Booking not found", 404);
        }

        if (!booking.approved_at) {
            throw new HttpException("Booking has not approved yet", 400);
        }

        if (booking.return_at) {
            throw new HttpException("Booking has already returned", 400);
        }

        await prisma.booking.update({
            where: {
                id: req.params.id,
            },
            data: {
                return_at: new Date(),
            },
        });

        // ASYNC PROCESS
        await prisma.inventory.update({
            where: {
                id: booking.bookingInventory[0].inventory_id,
            },
            data: {
                is_available: false,
                condition: InventoryCondition.GOOD,
            },
        });
        res.status(StatusCodes.OK).json(success("Success", null));
    },
};
