import { Router } from "express";
import authMiddlewaare from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { errorHandler } from "../../utils/error-handler";
import { bookingService } from "./booking.service";

const bookingRoutes: Router = Router();

bookingRoutes.post(
    "/",
    authMiddlewaare([Role.STAFF, Role.ADMIN]),
    errorHandler(bookingService.book)
);
bookingRoutes.get(
    "/",
    authMiddlewaare([Role.STAFF, Role.ADMIN]),
    errorHandler(bookingService.findMany)
);
bookingRoutes.post(
    "/:id/approve",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(bookingService.approve)
);
bookingRoutes.post(
    "/:id/return",
    authMiddlewaare([Role.STAFF, Role.ADMIN]),
    errorHandler(bookingService.return)
);
bookingRoutes.post(
    "/:id/reject",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(bookingService.reject)
);

export default bookingRoutes;
