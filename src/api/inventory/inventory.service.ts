import { Response } from "express";
import {
    inventoryBody,
    inventoryParams,
    inventoryQuery,
    InventoryRequest,
} from "./inventory.model";
import { inventoryRepository } from "./inventory.repository";
import { Pagination } from "../../utils/global-type";
import { StatusCodes } from "http-status-codes";
import { success } from "../../response/success";
import { HttpException } from "../../response/exception";

export const inventoryService = {
    findMany: async (req: InventoryRequest, res: Response) => {
        req.query = inventoryQuery.validateSync(req.query, {
            abortEarly: false,
        });

        const inventories = await inventoryRepository.findMany(req.query);

        // PAGINATION
        const totalCount = await inventoryRepository.count(req.query.keyword);
        const totalPage = Math.ceil(totalCount / req.query.limit);

        const pagination: Pagination = {
            page: req.query.page,
            total_page: totalPage,
            total_data: totalCount,
            data_in_page: inventories.length,
        };

        res.status(StatusCodes.OK).json(
            success("Success", inventories, pagination)
        );
    },
    findById: async (req: InventoryRequest, res: Response) => {
        req.params = inventoryParams.validateSync(req.params, {
            abortEarly: false,
        });

        const inventory = await inventoryRepository.findById(req.params.id);

        if (!inventory) {
            throw new HttpException(
                "Inventory not found",
                StatusCodes.NOT_FOUND
            );
        }

        res.status(StatusCodes.OK).json(success("Success", inventory));
    },
    create: async (req: InventoryRequest, res: Response) => {
        req.body = inventoryBody.validateSync(req.body, {
            abortEarly: false,
        });

        const createInventory = await inventoryRepository.create(
            req.body,
            req.user.id
        );

        res.status(StatusCodes.CREATED).json(
            success("Success", createInventory)
        );
    },
    update: async (req: InventoryRequest, res: Response) => {
        req.params = inventoryParams.validateSync(req.params, {
            abortEarly: false,
        });
        req.body = inventoryBody.validateSync(req.body, {
            abortEarly: false,
        });

        const inventory = await inventoryRepository.findById(req.params.id);

        if (!inventory) {
            throw new HttpException(
                "Inventory not found",
                StatusCodes.NOT_FOUND
            );
        }

        const updateInventory = await inventoryRepository.update(
            req.params.id,
            req.body,
            req.user.id
        );

        res.status(StatusCodes.OK).json(success("Success", updateInventory));
    },
    delete: async (req: InventoryRequest, res: Response) => {
        req.params = inventoryParams.validateSync(req.params, {
            abortEarly: false,
        });

        const inventory = await inventoryRepository.findById(req.params.id);

        if (!inventory) {
            throw new HttpException(
                "Inventory not found",
                StatusCodes.NOT_FOUND
            );
        }

        await inventoryRepository.delete(req.params.id, req.user.id);

        res.status(StatusCodes.OK).json(success("Success", null));
    },
};
