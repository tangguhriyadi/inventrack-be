import { Router } from "express";
import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";
import inventoryCategoryRoutes from "./inventory-category/inventory-category.route";
import inventoryRoutes from "./inventory/inventory.route";
import bookingRoutes from "./booking/booking.route";
import dashboardRoutes from "./dashboard/dashboard.route";

const ApiRoutes: Router = Router();

ApiRoutes.use("/auth", authRoutes);
ApiRoutes.use("/user", userRoutes);
ApiRoutes.use("/category", inventoryCategoryRoutes);
ApiRoutes.use("/inventory", inventoryRoutes);
ApiRoutes.use("/booking", bookingRoutes);
ApiRoutes.use("/dashboard", dashboardRoutes);

export default ApiRoutes;
