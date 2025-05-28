import { Role, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "../response/exception";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { ENV } from "../utils/secrets";
import { prisma } from "../plugins/prisma";
import { JWTPayload } from "../utils/global-type";

const authMiddlewaare =
    (roles: Role[]) =>
    async (req: Request, _res: Response, next: NextFunction) => {
        try {
            // 1.extract token from header
            const token = req.headers.authorization!.split(" ")[1];

            // 2. if token is not present, throw an error of unauthorized
            if (!token) {
                next(
                    new HttpException(
                        "Authentication is required",
                        StatusCodes.UNAUTHORIZED
                    )
                );
            }

            // 3. if token is present, verify that token and extract the payload
            const payload = jwt.verify(token, ENV.JWT_SECRET)! as User;

            // 4. to get the user from the payload
            const user = await prisma.user.findFirst({
                relationLoadStrategy: "join",
                where: { id: payload.id, is_deleted: false },
            });

            if (!user) {
                next(
                    new HttpException(
                        "User does not exist",
                        StatusCodes.UNAUTHORIZED
                    )
                );
            }

            // 5. check role
            if (!roles.includes(user?.role!)) {
                next(
                    new HttpException("Unauthorized!", StatusCodes.FORBIDDEN)
                );
            }
            // 6. to attach the user to the current request object
            const jwtPayload: JWTPayload = {
                id: user?.id!,
                name: user?.name!,
                email: user?.email!,
                role: user?.role!,
            };
            req.user = jwtPayload;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                next(
                    new HttpException("Token Expired", StatusCodes.UNAUTHORIZED)
                );
            }
            next(new HttpException("Invalid Token", StatusCodes.UNAUTHORIZED));
        }
    };

export default authMiddlewaare;
