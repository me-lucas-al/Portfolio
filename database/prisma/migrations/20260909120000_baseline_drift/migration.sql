-- Baseline migration: reconciles migration history with schema changes previously
-- applied to the database via `prisma db push`. Marked applied via
-- `prisma migrate resolve --applied`, not executed against the live database.

-- DropIndex
DROP INDEX "public"."assistant_answers_embedding_hnsw_idx";

-- DropIndex
DROP INDEX "public"."chunks_embedding_hnsw_idx";

-- AlterTable
ALTER TABLE "public"."Education" ADD COLUMN     "courseEn" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Experience" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "roleEn" TEXT;

-- AlterTable
ALTER TABLE "public"."chat_usage" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'chat';

-- AlterTable
ALTER TABLE "public"."links" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "titleEn" TEXT;

-- CreateTable
CREATE TABLE "public"."assistant_speech" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "textHash" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "voice" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "byteLength" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assistant_speech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assistant_speech_textHash_key" ON "public"."assistant_speech"("textHash" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "public"."system_settings"("key" ASC);

