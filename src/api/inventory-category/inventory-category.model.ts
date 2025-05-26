import { Request } from "express";
import * as yup from "yup";
import { QueryParams } from "../../utils/global-type";

export const inventoryCategoryParams = yup.object({
    id: yup.string().required(),
});

export const inventoryCategoryBody = yup.object({
    name: yup.string().required(),
});

export type InventoryCategoryParam = yup.InferType<
    typeof inventoryCategoryParams
>;
export type InventoryCategoryBody = yup.InferType<typeof inventoryCategoryBody>;

export type InventoryCategoryRequest = Request<
    InventoryCategoryParam,
    unknown,
    InventoryCategoryBody,
    QueryParams
>;
