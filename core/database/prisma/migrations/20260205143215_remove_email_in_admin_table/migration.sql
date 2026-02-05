/*
  Warnings:

  - You are about to drop the column `email` on the `Admin` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Admin_email_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "email";
