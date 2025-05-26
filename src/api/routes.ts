import { Router } from "express";
import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";

const ApiRoutes: Router = Router();

ApiRoutes.use("/auth", authRoutes);
ApiRoutes.use("/user", userRoutes);

export default ApiRoutes;
