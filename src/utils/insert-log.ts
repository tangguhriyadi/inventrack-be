import { ActionLog } from "@prisma/client";
import { prisma } from "../plugins/prisma";

export const insertLog = async (body: {
    user_id: string;
    user_name: string;
    inventory?: string;
    inventory_id?: string;
    inventory_name?: string;
    action: ActionLog;
}) => {
    try {
        await prisma.userLogs.create({
            data: {
                user_id: body.user_id,
                user_name: body.user_name,
                inventory: body.inventory_name,
                inventory_id: body.inventory_id,
                action: body.action,
            },
        });
    } catch {
        console.error("ERROR INSERTING LOG", JSON.stringify(body));
    }
};
