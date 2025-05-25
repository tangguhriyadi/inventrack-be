import dotenv from "dotenv";
import { cleanEnv, num, port, str } from "envalid";

dotenv.config({ path: ".env" });

export const ENV = cleanEnv(process.env, {
    PORT: port(),
    NODE_ENV: str({
        choices: ["production", "development", "local", "test", "staging"],
    }),
    JWT_SECRET: str(),
    SALT_ROUND: num(),
    JWT_EXPIRE: str(),
});
