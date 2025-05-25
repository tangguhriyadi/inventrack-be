import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { success } from "../../response/success";
import { HttpException } from "../../response/exception";
import {
    userBodySchema,
    userCreateBodySchema,
    UserCreateBodySchema,
    userParamsSchema,
    userQueryParamsSchema,
    UserRequest,
} from "./user.model";
import { userRepository } from "./user.repository";
import { Pagination } from "../../utils/global-type";
import bcrypt from "bcrypt";

export const userService = {
    findMany: async (req: UserRequest, res: Response) => {
        req.query = userQueryParamsSchema.validateSync(req.query, {
            abortEarly: false,
        });

        const users = await userRepository.findMany(req.query);

        // PAGINATION
        const totalCount = await userRepository.count(req.query);
        const totalPage = Math.ceil(totalCount / req.query.limit);

        const pagination: Pagination = {
            page: req.query.page,
            total_page: totalPage,
            total_data: totalCount,
            data_in_page: users.length,
        };

        res.status(StatusCodes.OK).json(success("Success", users, pagination));
    },
    findById: async (req: UserRequest, res: Response) => {
        req.params = userParamsSchema.validateSync(req.params, {
            abortEarly: false,
        });

        const user = await userRepository.findById(req.params.id);

        if (!user) {
            throw new HttpException("User Not Found", StatusCodes.NOT_FOUND);
        }

        user.password = null;

        res.status(StatusCodes.OK).json(success("Success", user));
    },
    findSelf: async (req: UserRequest, res: Response) => {
        const user = await userRepository.findById(req.user.id);

        if (!user) {
            throw new HttpException("User Not Found", StatusCodes.NOT_FOUND);
        }

        user.password = null;

        res.status(StatusCodes.OK).json(success("Success", user));
    },
    create: async (req: UserRequest, res: Response) => {
        req.body = userCreateBodySchema.validateSync(req.body, {
            abortEarly: false,
        });

        const body = req.body as UserCreateBodySchema;

        const user = await userRepository.findByEmail(body.email);
        if (user) {
            throw new HttpException(
                "Email Already Exists",
                StatusCodes.BAD_REQUEST
            );
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;

        await userRepository.create(body);

        res.status(StatusCodes.CREATED).json(success("Success", null));
    },
    update: async (req: UserRequest, res: Response) => {
        req.params = userParamsSchema.validateSync(req.params, {
            abortEarly: false,
        });

        req.body = userBodySchema.validateSync(req.body, {
            abortEarly: false,
        });

        const user = await userRepository.findById(req.params.id);
        if (!user) {
            throw new HttpException("User Not Found", StatusCodes.NOT_FOUND);
        }

        await userRepository.update(req.params.id, req.body);

        res.status(StatusCodes.OK).json(success("Success", null));
    },
    delete: async (req: UserRequest, res: Response) => {
        req.params = userParamsSchema.validateSync(req.params, {
            abortEarly: false,
        });

        const user = await userRepository.findById(req.params.id);
        if (!user) {
            throw new HttpException("User Not Found", StatusCodes.NOT_FOUND);
        }

        await userRepository.delete(req.params.id);

        res.status(StatusCodes.OK).json(success("Success", null));
    },
};
