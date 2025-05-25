import { NextFunction, Request, Response } from "express";
import { HttpException } from "../response/exception";

export const errorMiddleware = (
    error: HttpException,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    res.status(error.statusCode).json({
        message: error.message,
        errors: error.errors,
    });
};
