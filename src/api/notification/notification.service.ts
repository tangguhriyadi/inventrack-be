import { NotificationRequest } from "./notification.model";
import { queryParams } from "../../utils/global-type";
import { prisma } from "../../plugins/prisma";
import { StatusCodes } from "http-status-codes";
import { success } from "../../response/success";
import { Response } from "express";

export const notificationService = {
    findMany: async (req: NotificationRequest, res: Response) => {
        req.query = queryParams.validateSync(req.params, {
            abortEarly: false,
        });
        const notifications = await prisma.notification.findMany({
            where: {
                user_id: req.user.id,
            },
            take: req.query.limit,
            skip: (req.query.page - 1) * req.query.limit,
        });

        res.status(StatusCodes.OK).json(success("Success", notifications));
    },
    readAll: async (req: NotificationRequest, res: Response) => {
        await prisma.notification.updateMany({
            where: {
                user_id: req.user.id,
            },
            data: {
                is_read: true,
            },
        });
        res.status(StatusCodes.OK).json(success("Success", null));
    },
};
