import { Router } from "express";
import { authService } from "./auth.service";
import { errorHandler } from "../../utils/error-handler";
import authMiddlewaare from "../../middlewares/auth";
import { Role } from "@prisma/client";

const authRoutes: Router = Router();

authRoutes.post("/login", errorHandler(authService.login));
authRoutes.post(
    "/logout",
    authMiddlewaare([Role.STAFF, Role.ADMIN]),
    errorHandler(authService.logout)
);

export default authRoutes;
