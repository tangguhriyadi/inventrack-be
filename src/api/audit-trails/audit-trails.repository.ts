import { prisma } from "../../plugins/prisma";
import { QueryParams, transformSortOrder } from "../../utils/global-type";

export const auditTrailsRepository = {
    findMany: async (query: QueryParams) => {
        return await prisma.userLogs.findMany({
            orderBy: [
                {
                    created_at: transformSortOrder(query.order_by),
                },
            ],
            take: query.limit,
            skip: (query.page - 1) * query.limit,
        });
    },
    count: async () => {
        return await prisma.inventoryCategory.count();
    },
};
