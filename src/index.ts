import { logger, server } from "./app";
import { scheduleAutomaticReject } from "./scheduler/automatic-reject";
import { scheduleOverdueBookingChecker } from "./scheduler/overdue-checker";
// import { scheduleOverdueBookingChecker } from "./scheduler/overdue-checker";
import { ENV } from "./utils/secrets";

scheduleOverdueBookingChecker();
scheduleAutomaticReject()
// start server
server.listen(ENV.PORT, () => {
    logger.info(
        `Server with Socket.IO notifications running on port ${ENV.PORT}`
    );
});
