import { Router } from "express";
import authMiddlewaare from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { errorHandler } from "../../utils/error-handler";
import { dashboardService } from "./dashboard.service";

const dashboardRoutes: Router = Router();

dashboardRoutes.get(
    "/booked/top10",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(dashboardService.mostBooked)
);
dashboardRoutes.get(
    "/booked/byCategory",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(dashboardService.byCategory)
);
dashboardRoutes.get(
    "/booked/overdue",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(dashboardService.overdue)
);
dashboardRoutes.get(
    "/booked/byStatus",
    authMiddlewaare([Role.STAFF]),
    errorHandler(dashboardService.byStatus)
);

export default dashboardRoutes;
