import { prisma } from "../../lib/prisma";

const DEFAULT_DAILY_SLOTS = [
    { startTime: "09:00", endTime: "12:00", startMinute: 540, endMinute: 720 },
    { startTime: "12:00", endTime: "15:00", startMinute: 720, endMinute: 900 },
    { startTime: "15:00", endTime: "18:00", startMinute: 900, endMinute: 1080 },
];

const getDateAtUtcMidnight = (baseDate: Date, dayOffset: number) => {
    const utcDate = new Date(
        Date.UTC(
            baseDate.getUTCFullYear(),
            baseDate.getUTCMonth(),
            baseDate.getUTCDate() + dayOffset,
            0,
            0,
            0,
            0,
        ),
    );

    return utcDate;
};

export const generateNext30DaysSchedule = async () => {
    const resources = await prisma.resources.findMany({
        select: { id: true },
    });

    if (resources.length === 0) {
        return;
    }

    const rows = [] as Array<{
        resourceId: string;
        scheduleDate: Date;
        startTime: string;
        endTime: string;
        startMinute: number;
        endMinute: number;
    }>;

    const today = new Date();

    for (const resource of resources) {
        for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
            const scheduleDate = getDateAtUtcMidnight(today, dayOffset);

            for (const slot of DEFAULT_DAILY_SLOTS) {
                rows.push({
                    resourceId: resource.id,
                    scheduleDate,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    startMinute: slot.startMinute,
                    endMinute: slot.endMinute,
                });
            }
        }
    }

    await prisma.resourceSchedule.createMany({
        data: rows,
        skipDuplicates: true,
    });
};
