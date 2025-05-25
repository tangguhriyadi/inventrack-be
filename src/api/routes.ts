import { Router } from "express";
import authRoutes from "./auth/route";

const ApiRoutes: Router = Router();

ApiRoutes.use("/auth", authRoutes);

export default ApiRoutes;
