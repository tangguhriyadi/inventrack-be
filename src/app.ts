import express from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import requestLogger from "./middlewares/request-logger";
import { errorMiddleware } from "./middlewares/error";
import { notFound } from "./utils/not-found";
import bodyParser from "body-parser";
import ApiRoutes from "./api/routes";
import { healtCheck } from "./utils/health-check";

export const logger = pino({ name: "server start" });
const app = express();

// middlewares
// app.use(cors({ origin: ["*"] }));
app.use(cors());
app.use(helmet());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.json());

// request logger
app.use(requestLogger);

// register API routes
app.use("/api", ApiRoutes);
app.get("/", healtCheck);

// route not found handler
app.use(notFound);

// error middleware
app.use(errorMiddleware);

export default app;
