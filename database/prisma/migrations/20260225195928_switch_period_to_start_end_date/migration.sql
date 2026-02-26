/*
  Warnings:

  - You are about to drop the column `period` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `Experience` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "period",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "period",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
