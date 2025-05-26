import { Router } from "express";
import { Role } from "@prisma/client";
import { errorHandler } from "../../utils/error-handler";
import authMiddlewaare from "../../middlewares/auth";
import { inventoryCategoryService } from "./inventory-category.service";

const inventoryCategoryRoutes: Router = Router();

inventoryCategoryRoutes.get("/", errorHandler(inventoryCategoryService.findMany));
inventoryCategoryRoutes.get("/:id", errorHandler(inventoryCategoryService.findById));
inventoryCategoryRoutes.post(
    "/",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(inventoryCategoryService.create)
);
inventoryCategoryRoutes.patch(
    "/:id",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(inventoryCategoryService.update)
);
inventoryCategoryRoutes.delete(
    "/:id",
    authMiddlewaare([Role.ADMIN]),
    errorHandler(inventoryCategoryService.delete)
);

export default inventoryCategoryRoutes;
