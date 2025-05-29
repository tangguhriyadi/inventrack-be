import { Response } from "express";
import { AuditTrailsRequest } from "./audit-trails.model";
import { Pagination, queryParams } from "../../utils/global-type";
import { auditTrailsRepository } from "./audit-trails.repository";
import { StatusCodes } from "http-status-codes";
import { success } from "../../response/success";

export const auditTrailsService = {
    findMany: async (req: AuditTrailsRequest, res: Response) => {
        req.query = queryParams.validateSync(req.query, { abortEarly: false });

        const logs = await auditTrailsRepository.findMany(req.query);

        // PAGINATION
        const totalCount = await auditTrailsRepository.count();
        const totalPage = Math.ceil(totalCount / req.query.limit);

        const pagination: Pagination = {
            page: req.query.page,
            total_page: totalPage,
            total_data: totalCount,
            data_in_page: logs.length,
        };

        res.status(StatusCodes.OK).json(success("Success", logs, pagination));
    },
};
