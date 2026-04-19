import { Router } from "express";
import z from "zod";
import { validateRequest } from "../../middleware/validateRequest";
import { BookingController } from "./bookings.controller";

const createBookingSchema = z.object({
    resource_id: z.string().trim().min(1),
    requested_by: z.string().trim().min(1),
    booking_date: z.string().trim().min(1),
    start_time: z.string().trim().optional(),
    end_time: z.string().trim().optional(),
});

const router = Router();

router.get("/", BookingController.getAllBookings);
router.post(
    "/",
    validateRequest(createBookingSchema),
    BookingController.createBooking,
);
router.delete("/:id", BookingController.deleteBooking);

export const BookingRoutes = router;
