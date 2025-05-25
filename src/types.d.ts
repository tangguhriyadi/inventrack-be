import { JWTPayload } from "./utils/global-type";

declare global {
    namespace Express {
        interface Request {
            user: JWTPayload;
        }
    }
}
