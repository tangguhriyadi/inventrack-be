import { Role } from "@prisma/client";

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