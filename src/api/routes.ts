import { Router } from "express";
import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";
import inventoryCategoryRoutes from "./inventory-category/inventory-category.route";
import inventoryRoutes from "./inventory/inventory.route";
import bookingRoutes from "./booking/booking.route";

const ApiRoutes: Router = Router();

ApiRoutes.use("/auth", authRoutes);
ApiRoutes.use("/user", userRoutes);
ApiRoutes.use("/category", inventoryCategoryRoutes);
ApiRoutes.use("/inventory", inventoryRoutes);
ApiRoutes.use("/booking", bookingRoutes);

export default ApiRoutes;
