import { Router } from "express";
import { notificationService } from "./notification.service";
import { errorHandler } from "../../utils/error-handler";
import authMiddlewaare from "../../middlewares/auth";
import { Role } from "@prisma/client";

const notificationRoutes: Router = Router();

notificationRoutes.get(
    "/",
    authMiddlewaare([Role.ADMIN, Role.STAFF]),
    errorHandler(notificationService.findMany)
);
notificationRoutes.get(
    "/read",
    authMiddlewaare([Role.ADMIN, Role.STAFF]),
    errorHandler(notificationService.readAll)
);

export default notificationRoutes;
