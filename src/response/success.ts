import { Pagination } from "../utils/global-type";
export const success = (
    message: string,
    results: unknown,
    pagination?: Pagination
) => {
    return {
        message,
        results,
        pagination,
    };
};
