import { Gender, Role } from "@prisma/client";
import { Request } from "express";
import * as yup from "yup";

export const userParamsSchema = yup.object({
    id: yup.string().required(),
});

export type UserParams = yup.InferType<typeof userParamsSchema>;

export const userQueryParamsSchema = yup.object({
    page: yup
        .number()
        .transform((value) => Number(value))
        .default(1),
    limit: yup
        .number()
        .transform((value) => Number(value))
        .default(10),
    sort_added: yup
        .string()
        .oneOf(["latest", "oldest"], "Invalid sort value")
        .default("latest"),
    keyword: yup.string().default(""),
    role: yup.string().oneOf(Object.values(Role)).optional(),
});

export const userBodySchema = yup.object({
    name: yup.string().required(),
    role: yup.string().oneOf(Object.values(Role)).required(),
    gender: yup.string().oneOf(Object.values(Gender)).required(),
});

export const userCreateBodySchema = userBodySchema.shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
})


export type UserBodySchema = yup.InferType<typeof userBodySchema>;
export type UserCreateBodySchema = yup.InferType<typeof userCreateBodySchema>;

export type UserQueryParams = yup.InferType<typeof userQueryParamsSchema>;

export type UserRequest = Request<
    UserParams, // req params
    unknown, // res body
    UserBodySchema | UserCreateBodySchema, // req payload
    UserQueryParams // req query
>;
