import { Router } from "express";
import { authService } from "./auth.service";
import { errorHandler } from "../../utils/error-handler";

const authRoutes: Router = Router();

authRoutes.post("/login", errorHandler(authService.login));
authRoutes.post("/logout", errorHandler(authService.logout));

export default authRoutes;
