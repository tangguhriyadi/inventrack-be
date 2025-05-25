import app, { logger } from "./app";
import { ENV } from "./utils/secrets";

// start server
app.listen(ENV.PORT, () => {
    logger.info(`server is running in port ${ENV.PORT}`);
});
