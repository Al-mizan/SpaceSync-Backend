import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ResourceService } from "./resources.service";

const getAllResources = catchAsync(async (req, res) => {
    const resources = await ResourceService.getAllResources();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Resources fetched successfully",
        data: resources,
    });
});

const createResource = catchAsync(async (req, res) => {
    const resource = await ResourceService.createResource(req.body);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Resource created successfully",
        data: resource,
    });
});

export const ResourceController = {
    getAllResources,
    createResource,
};
