import { Router } from "express";
import authMiddlewaare from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { errorHandler } from "../../utils/error-handler";
import { auditTrailsService } from "./audit-trails.service";

const auditTrailsRoute: Router = Router();

auditTrailsRoute.get(
    "/",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(auditTrailsService.findMany)
);

export default auditTrailsRoute;
