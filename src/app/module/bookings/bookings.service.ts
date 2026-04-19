import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const parseTimeToMinute = (time: string) => {
    const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.exec(time);

    if (!match) {
        throw new AppError(
            status.BAD_REQUEST,
            "Invalid time format. Use HH:mm",
        );
    }

    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
};

const parseBookingDate = (bookingDate: string) => {
    const isDateFormatValid = /^\d{4}-\d{2}-\d{2}$/.test(bookingDate);
    if (!isDateFormatValid) {
        throw new AppError(
            status.BAD_REQUEST,
            "booking_date must be in YYYY-MM-DD format",
        );
    }

    const date = new Date(`${bookingDate}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
        throw new AppError(status.BAD_REQUEST, "Invalid booking_date");
    }

    return date;
};

type CreateBookingPayload = {
    resource_id: string;
    requested_by: string;
    booking_date: string;
    start_time?: string;
    end_time?: string;
};

const createBooking = async (payload: CreateBookingPayload) => {
    const bookingDate = parseBookingDate(payload.booking_date);
    const startTime = payload.start_time ?? "09:00";
    const endTime = payload.end_time ?? "12:00";

    const startMinute = parseTimeToMinute(startTime);
    const endMinute = parseTimeToMinute(endTime);

    if (endMinute <= startMinute) {
        throw new AppError(
            status.BAD_REQUEST,
            "end_time must be greater than start_time",
        );
    }

    const resource = await prisma.resources.findUnique({
        where: { id: payload.resource_id },
    });

    if (!resource) {
        throw new AppError(status.NOT_FOUND, "Resource not found");
    }

    const schedule = await prisma.resourceSchedule.findUnique({
        where: {
            resourceId_scheduleDate_startMinute_endMinute: {
                resourceId: payload.resource_id,
                scheduleDate: bookingDate,
                startMinute,
                endMinute,
            },
        },
    });

    if (!schedule) {
        throw new AppError(
            status.BAD_REQUEST,
            "Requested slot is unavailable in generated schedule",
        );
    }

    const conflictingBooking = await prisma.booking.findFirst({
        where: {
            resourceId: payload.resource_id,
            bookingDate,
            status: "Confirmed",
            AND: [
                { startMinute: { lt: endMinute } },
                { endMinute: { gt: startMinute } },
            ],
        },
    });

    if (conflictingBooking) {
        throw new AppError(
            status.CONFLICT,
            "This resource is already booked for the requested time",
        );
    }

    return prisma.$transaction(async (tx) => {
        const scheduleUpdate = await tx.resourceSchedule.updateMany({
            where: {
                resourceId: payload.resource_id,
                scheduleDate: bookingDate,
                startMinute,
                endMinute,
                isBooked: false,
            },
            data: {
                isBooked: true,
            },
        });

        if (scheduleUpdate.count === 0) {
            throw new AppError(
                status.CONFLICT,
                "This slot has already been booked",
            );
        }

        return tx.booking.create({
            data: {
                resourceId: payload.resource_id,
                requestedBy: payload.requested_by,
                bookingDate,
                startTime,
                endTime,
                startMinute,
                endMinute,
                status: "Confirmed",
            },
            include: {
                resource: true,
            },
        });
    });
};

const getAllBookings = async () => {
    return prisma.booking.findMany({
        orderBy: [{ bookingDate: "desc" }, { startMinute: "asc" }],
        include: {
            resource: true,
        },
    });
};

const deleteBooking = async (id: string) => {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
        throw new AppError(status.NOT_FOUND, "Booking not found");
    }

    await prisma.$transaction(async (tx) => {
        await tx.booking.delete({ where: { id } });

        await tx.resourceSchedule.updateMany({
            where: {
                resourceId: booking.resourceId,
                scheduleDate: booking.bookingDate,
                startMinute: booking.startMinute,
                endMinute: booking.endMinute,
            },
            data: {
                isBooked: false,
            },
        });
    });

    return booking;
};

export const BookingService = {
    createBooking,
    getAllBookings,
    deleteBooking,
};
