import { JWTPayload } from "./utils/global_type";

declare global {
    namespace Express {
        interface Request {
            user: JWTPayload;
        }
    }
}
