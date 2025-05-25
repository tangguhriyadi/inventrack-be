import { Router } from "express";
import { authService } from "./service";
import { errorHandler } from "../../utils/error-handler";

const authRoutes: Router = Router();

authRoutes.post("/login", errorHandler(authService.login));

export default authRoutes;
