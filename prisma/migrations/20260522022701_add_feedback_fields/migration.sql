-- AlterTable
ALTER TABLE "CallFeedbackLog" ADD COLUMN     "caring_message" TEXT,
ADD COLUMN     "meal" BOOLEAN,
ADD COLUMN     "meal_detail" TEXT,
ADD COLUMN     "medication_detail" TEXT,
ADD COLUMN     "medication_status" BOOLEAN,
ADD COLUMN     "today_activity" TEXT;
