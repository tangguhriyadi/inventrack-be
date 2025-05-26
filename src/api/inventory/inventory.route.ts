import { Router } from "express";
import { Role } from "@prisma/client";
import { errorHandler } from "../../utils/error-handler";
import authMiddlewaare from "../../middlewares/auth";
import { inventoryService } from "./inventory.service";

const inventoryRoutes: Router = Router();

inventoryRoutes.get("/", errorHandler(inventoryService.findMany));
inventoryRoutes.get("/:id", errorHandler(inventoryService.findById));
inventoryRoutes.post(
    "/",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(inventoryService.create)
);
inventoryRoutes.patch(
    "/:id",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(inventoryService.update)
);
inventoryRoutes.delete(
    "/:id",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(inventoryService.delete)
);

export default inventoryRoutes;
