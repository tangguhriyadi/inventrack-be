import express from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import { createServer } from "http";
import { Server } from "socket.io";
import requestLogger from "./middlewares/request-logger";
import { errorMiddleware } from "./middlewares/error";
import { notFound } from "./utils/not-found";
import bodyParser from "body-parser";
import ApiRoutes from "./api/routes";
import { healtCheck } from "./utils/health-check";

export const logger = pino({ name: "server start" });
const app = express();

// Create HTTP server
export const server = createServer(app);

// Initialize Socket.IO for notifications
export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["polling", "websocket"],
    allowEIO3: true,
});

// Simple notification system
io.on("connection", (socket) => {
    logger.info(`Client connected for notifications: ${socket.id}`);

    // Optional: Join user-specific room for targeted notifications
    socket.on("join-user", (userId) => {
        socket.join(`user_${userId}`);
        logger.info(`Socket ${socket.id} joined user room: user_${userId}`);
    });

    socket.on("disconnect", () => {
        logger.info(`Client disconnected: ${socket.id}`);
    });
});

// Helper function to send notifications
export const sendNotification = (data: any, userId?: string) => {
    // Send to specific user
    io.to(`user_${userId}`).emit("notification", {
        ...data,
        timestamp: new Date().toISOString(),
    });
    logger.info(`Notification sent to user ${userId}:`, data);
};

// middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
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
