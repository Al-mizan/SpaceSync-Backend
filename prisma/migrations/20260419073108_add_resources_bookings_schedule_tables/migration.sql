/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_specialties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medical_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient_health_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prescriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specialties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_userId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "doctor" DROP CONSTRAINT "doctor_userId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_patientId_fkey";

-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_userId_fkey";

-- DropForeignKey
ALTER TABLE "patient_health_data" DROP CONSTRAINT "patient_health_data_patientId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_patientId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_patientId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "admins";

-- DropTable
DROP TABLE "appointments";

-- DropTable
DROP TABLE "doctor";

-- DropTable
DROP TABLE "doctor_schedules";

-- DropTable
DROP TABLE "doctor_specialties";

-- DropTable
DROP TABLE "medical_reports";

-- DropTable
DROP TABLE "patient";

-- DropTable
DROP TABLE "patient_health_data";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "prescriptions";

-- DropTable
DROP TABLE "reviews";

-- DropTable
DROP TABLE "schedules";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "specialties";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "verification";

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "requested_by" TEXT NOT NULL,
    "booking_date" DATE NOT NULL,
    "start_time" TEXT NOT NULL DEFAULT '09:00',
    "end_time" TEXT NOT NULL DEFAULT '12:00',
    "start_minute" INTEGER NOT NULL DEFAULT 540,
    "end_minute" INTEGER NOT NULL DEFAULT 720,
    "status" TEXT NOT NULL DEFAULT 'Confirmed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_schedules" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "schedule_date" DATE NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "start_minute" INTEGER NOT NULL,
    "end_minute" INTEGER NOT NULL,
    "is_booked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bookings_resource_id_booking_date_idx" ON "bookings"("resource_id", "booking_date");

-- CreateIndex
CREATE INDEX "resource_schedules_resource_id_schedule_date_idx" ON "resource_schedules"("resource_id", "schedule_date");

-- CreateIndex
CREATE UNIQUE INDEX "resource_schedules_resource_id_schedule_date_start_minute_e_key" ON "resource_schedules"("resource_id", "schedule_date", "start_minute", "end_minute");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_schedules" ADD CONSTRAINT "resource_schedules_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
