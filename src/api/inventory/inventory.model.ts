import { InventoryCondition } from "@prisma/client";
import { Request } from "express";
import * as yup from "yup";
import { queryParams } from "../../utils/global-type";

export const inventoryQuery = queryParams.shape({
    condition: yup.string().oneOf(Object.values(InventoryCondition)).optional(),
    category_id: yup.string().optional(),
});

export const inventoryParams = yup.object({
    id: yup.string().required(),
});

export const inventoryBody = yup.object({
    name: yup.string().required(),
    quantity: yup.number().required().min(1),
    category_id: yup.string().required(),
    is_available: yup.boolean().required(),
    condition: yup.string().oneOf(Object.values(InventoryCondition)),
    image_url: yup.string().required(),
});

export type InventoryQuery = yup.InferType<typeof inventoryQuery>;
export type InventoryBody = yup.InferType<typeof inventoryBody>;
export type InventoryParams = yup.InferType<typeof inventoryParams>;

export type InventoryRequest = Request<
    InventoryParams,
    unknown,
    InventoryBody,
    InventoryQuery
>;
