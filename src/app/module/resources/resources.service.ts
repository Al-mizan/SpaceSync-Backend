import { prisma } from "../../lib/prisma";

const getAllResources = async () => {
    return prisma.resources.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

type CreateResourcePayload = {
    name: string;
    type: string;
    capacity: number;
};

const createResource = async (payload: CreateResourcePayload) => {
    return prisma.resources.create({
        data: {
            name: payload.name,
            type: payload.type,
            capacity: payload.capacity,
        },
    });
};

export const ResourceService = {
    getAllResources,
    createResource,
};
