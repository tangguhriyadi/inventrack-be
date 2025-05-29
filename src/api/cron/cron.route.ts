import { Router } from "express";
import { errorHandler } from "../../utils/error-handler";
import { cronService } from "./cron.service";

const cronRoutes: Router = Router()

cronRoutes.get("/overdue-booking", errorHandler(cronService.overdueBooking))
cronRoutes.get("/overdue-approval", errorHandler(cronService.overdueApproval))

export default cronRoutes