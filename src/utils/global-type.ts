import { Role } from "@prisma/client";
import * as yup from "yup";

export type Pagination = {
    page: number;
    total_page: number;
    total_data: number;
    data_in_page: number;
};

export type JWTPayload = {
    id: string;
    name: string;
    email: string;
    role: Role;
};

// Define a Zod schema for query parameters
export const queryParams = yup.object({
    page: yup
        .number()
        .transform((value) => Number(value))
        .default(1),
    limit: yup
        .number()
        .transform((value) => Number(value))
        .default(10),
    sort_added: yup
        .string()
        .oneOf(["latest", "oldest"], "Invalid sort value")
        .default("latest"),
    keyword: yup.string().optional().default(""),
});

// Type alias for the inferred type from Zod schema
export type QueryParams = yup.InferType<typeof queryParams>;

export const transformSortOrder = (sort_added: string) => {
    if (sort_added === "oldest") {
        return "asc";
    }

    return "desc";
};
