import { Router } from "express";
import { errorHandler } from "../../utils/error-handler";
import { Role } from "@prisma/client";
import { userService } from "./user.service";
import authMiddlewaare from "../../middlewares/auth";

const userRoutes: Router = Router();

userRoutes.get(
    "/",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(userService.findMany)
);
userRoutes.post(
    "/",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(userService.create)
);
userRoutes.get(
    "/:id",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(userService.findById)
);
userRoutes.patch(
    "/:id",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(userService.update)
);
userRoutes.delete(
    "/:id",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(userService.delete)
);

export default userRoutes;
