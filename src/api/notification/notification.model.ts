import { Request } from "express";
import { QueryParams } from "../../utils/global-type";

export type NotificationRequest = Request<
    unknown,
    unknown,
    unknown,
    QueryParams
>;
