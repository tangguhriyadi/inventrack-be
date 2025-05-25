import { StatusCodes } from "http-status-codes";
import { HttpException } from "../../response/exception";
import { LoginRequest, loginSchema } from "./model";
import { compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWTPayload } from "../../utils/global-type";
import { userRepository } from "../user/user.repository";
import { ENV } from "../../utils/secrets";
import { success } from "../../response/success";
import { Response } from "express";

export const authService = {
    login: async (req: LoginRequest, res: Response) => {
        // schema validation
        req.body = loginSchema.validateSync(req.body, { abortEarly: false });

        const user = await userRepository.findByEmail(req.body.email);

        if (!user) {
            throw new HttpException(
                "Account does not exist, please try again",
                StatusCodes.NOT_FOUND
            );
        }

        if (!compareSync(req.body.password, user.password!)) {
            throw new HttpException(
                "Incorrect Password",
                StatusCodes.BAD_REQUEST
            );
        }

        const jwtPayload: JWTPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(jwtPayload, ENV.JWT_SECRET);

        res.status(StatusCodes.OK).json(
            success("Login Successed !", { user: jwtPayload, token })
        );
    },
};
