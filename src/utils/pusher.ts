import { sendNotification } from "../app";

export interface NotificationData {
    title: string;
    message: string;
    type?: "success" | "error" | "warning" | "info";
    action?: {
        label: string;
        url: string;
    };
}

export class NotificationService {
    // Send notification to specific user
    static sendToUser(userId: string, data: NotificationData) {
        sendNotification(data, userId);
    }

    // Common notification types
    static success(
        title: string,
        message: string,
        userId: string,
    ) {
        const data: NotificationData = {
            title,
            message,
            type: "success",
        };

        this.sendToUser(userId, data);
    }

    static error(
        title: string,
        message: string,
        userId: string,
    ) {
        const data: NotificationData = {
            title,
            message,
            type: "error",
        };

        this.sendToUser(userId, data);
    }

    static info(
        title: string,
        message: string,
        userId: string,
        action?: NotificationData["action"]
    ) {
        const data: NotificationData = {
            title,
            message,
            type: "info",
            action,
        };

        this.sendToUser(userId, data);
    }
}
