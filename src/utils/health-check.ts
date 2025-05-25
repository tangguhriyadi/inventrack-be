import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const healtCheck = (_req: Request, res: Response) => {
    try {
        res.status(StatusCodes.OK).json({ message: "Server is healthy" });
    } catch {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server is not health !",
        });
    }
};
