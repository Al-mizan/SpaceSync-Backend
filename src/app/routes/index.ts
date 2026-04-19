import { Router } from "express";
import { BookingRoutes } from "../module/bookings/bookings.route";
import { ResourceRoutes } from "../module/resources/resources.route";

const router = Router();

router.use("/resources", ResourceRoutes);
router.use("/bookings", BookingRoutes);

export const IndexRoutes = router;
