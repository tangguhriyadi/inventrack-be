import { Request } from "express";
import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

export type LoginSchema = yup.InferType<typeof loginSchema>;

export type LoginRequest = Request<
    unknown, // params
    unknown, // res body
    LoginSchema, // req payload
    unknown // req query
>;
