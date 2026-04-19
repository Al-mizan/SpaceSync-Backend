import { Router } from "express";
// import z from "zod";
// import { validateRequest } from "../../middleware/validateRequest";
import { ResourceController } from "./resources.controller";

// const createResourceSchema = z.object({
//     name: z.string().trim().min(1),
//     type: z.string().trim().min(1),
//     capacity: z.number().int().positive(),
// });

const router = Router();

router.get("/", ResourceController.getAllResources);
router.post(
    "/",
    // validateRequest(createResourceSchema),
    ResourceController.createResource,
);

export const ResourceRoutes = router;
