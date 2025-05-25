import { StatusCodes } from "http-status-codes";

export class HttpException extends Error {
    message: string;
    statusCode: number;
    errors?: any;

    constructor(message: string, statusCode: StatusCodes, errors?: any) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
