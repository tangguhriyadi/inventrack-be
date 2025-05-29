import { StatusCodes } from "http-status-codes";
import {
    inventoryCategoryBody,
    inventoryCategoryParams,
    InventoryCategoryRequest,
} from "./inventory-category.model";
import { Pagination, queryParams } from "../../utils/global-type";
import { inventoryCategoryRepository } from "./inventory-category.repository";
import { success } from "../../response/success";
import { Response } from "express";
import { HttpException } from "../../response/exception";
import { prisma } from "../../plugins/prisma";

export const inventoryCategoryService = {
    findMany: async (req: InventoryCategoryRequest, res: Response) => {
        req.query = queryParams.validateSync(req.query, { abortEarly: false });

        const inventoryCategories = await inventoryCategoryRepository.findMany(
            req.query
        );

        // PAGINATION
        const totalCount = await inventoryCategoryRepository.count(
            req.query.keyword
        );
        const totalPage = Math.ceil(totalCount / req.query.limit);

        const pagination: Pagination = {
            page: req.query.page,
            total_page: totalPage,
            total_data: totalCount,
            data_in_page: inventoryCategories.length,
        };

        res.status(StatusCodes.OK).json(
            success("Success", inventoryCategories, pagination)
        );
    },
    findById: async (req: InventoryCategoryRequest, res: Response) => {
        req.params = inventoryCategoryParams.validateSync(req.params, {
            abortEarly: false,
        });

        const inventoryCategory = await inventoryCategoryRepository.findById(
            req.params.id
        );

        if (!inventoryCategory) {
            throw new HttpException(
                "Category not found",
                StatusCodes.NOT_FOUND
            );
        }

        res.status(StatusCodes.OK).json(success("Success", inventoryCategory));
    },
    create: async (req: InventoryCategoryRequest, res: Response) => {
        req.body = inventoryCategoryBody.validateSync(req.body, {
            abortEarly: false,
        });

        const category = await prisma.inventoryCategory.findFirst({
            where: {
                is_deleted: false,
                name: req.body.name,
            },
        });

        if (category) {
            throw new HttpException(
                `Category name '${req.body.name}' is already exist`,
                StatusCodes.BAD_REQUEST
            );
        }

        const createCategory = await inventoryCategoryRepository.create(
            req.body,
            req.user.id
        );

        res.status(StatusCodes.CREATED).json(
            success("Success", createCategory)
        );
    },
    update: async (req: InventoryCategoryRequest, res: Response) => {
        req.params = inventoryCategoryParams.validateSync(req.params, {
            abortEarly: false,
        });
        req.body = inventoryCategoryBody.validateSync(req.body, {
            abortEarly: false,
        });

        const category = await inventoryCategoryRepository.findById(
            req.params.id
        );

        if (!category) {
            throw new HttpException(
                "Category not found",
                StatusCodes.NOT_FOUND
            );
        }

        const duplicateCategory = await prisma.inventoryCategory.findFirst({
            where: {
                name: req.body.name,
                is_deleted: false,
                NOT: {
                    id: req.params.id,
                },
            },
        });

        if (duplicateCategory) {
            throw new HttpException(
                `Category name '${req.body.name}' is already exist`,
                StatusCodes.BAD_REQUEST
            );
        }

        const updateInventoryCategory =
            await inventoryCategoryRepository.update(
                req.params.id,
                req.body,
                req.user.id
            );

        res.status(StatusCodes.OK).json(
            success("Success", updateInventoryCategory)
        );
    },
    delete: async (req: InventoryCategoryRequest, res: Response) => {
        req.params = inventoryCategoryParams.validateSync(req.params, {
            abortEarly: false,
        });

        const category = await inventoryCategoryRepository.findById(
            req.params.id
        );

        if (!category) {
            throw new HttpException(
                "Category not found",
                StatusCodes.NOT_FOUND
            );
        }

        await inventoryCategoryRepository.delete(req.params.id, req.user.id);

        res.status(StatusCodes.OK).json(success("Success", null));
    },
};
