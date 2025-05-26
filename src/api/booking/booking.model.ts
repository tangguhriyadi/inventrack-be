import { Request } from "express";
import * as yup from "yup";
import { queryParams } from "../../utils/global-type";

export const bookingQuery = queryParams.shape({
    category_id: yup.string().optional(),
});

export const bookingParams = yup.object({
    id: yup.string().required(),
});

export const bookingBody = yup.object({
    inventory_id: yup.string().required(),
    quantity: yup.number().required().min(1),
    booking_at: yup.date().required(),
    plan_return_at: yup.date().required(),
});

export const rejectBody = yup.object({
    reason: yup.string().required(),
});

export type BookingBody = yup.InferType<typeof bookingBody>;
export type RejectBody = yup.InferType<typeof rejectBody>;
export type BoookingQuery = yup.InferType<typeof bookingQuery>;
export type BookingParams = yup.InferType<typeof bookingParams>;

export type BookingRequest = Request<
    BookingParams,
    unknown,
    BookingBody,
    BoookingQuery
>;

export type RejectRequest = Request<
    BookingParams,
    unknown,
    RejectBody,
    BoookingQuery
>;
