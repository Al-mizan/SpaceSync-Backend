import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { BookingService } from "./bookings.service";

const createBooking = catchAsync(async (req, res) => {
    const booking = await BookingService.createBooking(req.body);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
});

const getAllBookings = catchAsync(async (req, res) => {
    const bookings = await BookingService.getAllBookings();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Bookings fetched successfully",
        data: bookings,
    });
});

const deleteBooking = catchAsync(async (req, res) => {
    const bookingId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
    await BookingService.deleteBooking(bookingId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Booking deleted successfully",
    });
});

export const BookingController = {
    createBooking,
    getAllBookings,
    deleteBooking,
};
