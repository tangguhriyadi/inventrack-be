import { NextFunction, Request, Response } from "express";
import { HttpException } from "../response/exception";
import { ValidationError } from "yup";
import { StatusCodes } from "http-status-codes";
import { logger } from "../app";
import { ENV } from "./secrets";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (err: any) {
            let exception: HttpException;

            if (err instanceof ValidationError) {
                exception = new HttpException(
                    "Invalid Body Request",
                    StatusCodes.UNPROCESSABLE_ENTITY,
                    err
                );
            } else if (err instanceof HttpException) {
                exception = err;
            } else {
                exception = new HttpException(
                    "Something went wrong!",
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    err
                );
            }
            if (!ENV.isProduction) {
                logger.error(exception);
            }
            next(exception);
        }
    };
};
