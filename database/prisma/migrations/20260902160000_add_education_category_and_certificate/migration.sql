-- CreateEnum
CREATE TYPE "EducationCategory" AS ENUM ('ACADEMIC', 'COURSE');

-- AlterTable
ALTER TABLE "Education" ADD COLUMN "category" "EducationCategory" NOT NULL DEFAULT 'ACADEMIC',
ADD COLUMN "certificateUrl" TEXT;
