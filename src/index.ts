import { logger, server } from "./app";
// import { scheduleOverdueBookingChecker } from "./scheduler/overdue-checker";
import { ENV } from "./utils/secrets";

// scheduleOverdueBookingChecker();
// start server
server.listen(ENV.PORT, () => {
    logger.info(
        `Server with Socket.IO notifications running on port ${ENV.PORT}`
    );
});
