import { Router } from "express";
import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";
import inventoryCategoryRoutes from "./inventory-category/inventory-category.route";

const ApiRoutes: Router = Router();

ApiRoutes.use("/auth", authRoutes);
ApiRoutes.use("/user", userRoutes);
ApiRoutes.use("/category", inventoryCategoryRoutes);

export default ApiRoutes;
