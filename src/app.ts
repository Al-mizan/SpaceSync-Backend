/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { IndexRoutes } from "./app/routes";
import qs from "qs";
import cron from "node-cron";
import { generateNext30DaysSchedule } from "./app/module/bookings/bookings.schedule";

const app: Application = express();

app.set("query parser", (str: string) => qs.parse(str));

app.use(
    cors({
        origin: [
            envVars.FRONTEND_URL,
            "http://localhost:3000",
            "http://localhost:5000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

cron.schedule("10 0 * * *", async () => {
    try {
        console.log(
            "Running cron job to generate next 30 days resource schedules...",
        );
        await generateNext30DaysSchedule();
    } catch (error: any) {
        console.error(
            "Error occurred while generating resource schedules: ",
            error.message,
        );
    }
});

void generateNext30DaysSchedule().catch((error: Error) => {
    console.error("Initial schedule generation failed:", error.message);
});

app.use("/api/v1", IndexRoutes);
app.use("/api", IndexRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
    res.status(201).json({
        success: true,
        message: "Space Sync's API is working",
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
