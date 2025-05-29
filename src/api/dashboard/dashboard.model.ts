import * as yup from "yup";

import { Request } from "express";
import { queryParams } from "../../utils/global-type";

export const dashboardQuery = queryParams.shape({
    start_date: yup.date().optional(),
    end_date: yup.date().optional(),
});

export type DashboardQuery = yup.InferType<typeof dashboardQuery>;

export type DashboardRequest = Request<
    unknown,
    unknown,
    unknown,
    DashboardQuery
>;
