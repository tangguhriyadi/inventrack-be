import app, { logger } from "./app";
// import { scheduleOverdueBookingChecker } from "./scheduler/overdue-checker";
import { ENV } from "./utils/secrets";

// scheduleOverdueBookingChecker();
// start server
app.listen(ENV.PORT, () => {
    logger.info(`server is running in port ${ENV.PORT}`);
});
