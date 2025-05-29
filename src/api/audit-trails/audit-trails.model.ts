import { Request } from "express";
import * as yup from "yup";
import { QueryParams } from "../../utils/global-type";

export const auditTrailsParams = yup.object({
    id: yup.string().required(),
});

export const auditTrailsBody = yup.object({
    name: yup.string().required(),
});

export type AuditTrailsParam = yup.InferType<
    typeof auditTrailsParams
>;
export type AuditTrailsBody = yup.InferType<typeof auditTrailsBody>;

export type AuditTrailsRequest = Request<
    AuditTrailsParam,
    unknown,
    AuditTrailsBody,
    QueryParams
>;
