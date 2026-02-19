/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "imageUrl",
ADD COLUMN     "imagesUrl" TEXT[];
