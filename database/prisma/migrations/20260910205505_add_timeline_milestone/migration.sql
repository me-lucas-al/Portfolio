-- CreateEnum
CREATE TYPE "TimelineMilestoneKind" AS ENUM ('MILESTONE', 'GAP');

-- CreateTable
CREATE TABLE "timeline_milestones" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "TimelineMilestoneKind" NOT NULL DEFAULT 'MILESTONE',
    "dateLabelPt" TEXT NOT NULL,
    "dateLabelEn" TEXT,
    "titlePt" TEXT NOT NULL,
    "titleEn" TEXT,
    "impactPt" TEXT NOT NULL,
    "impactEn" TEXT,
    "narrationPt" TEXT NOT NULL,
    "narrationEn" TEXT,
    "problemPt" TEXT NOT NULL,
    "problemEn" TEXT,
    "inflectionPt" TEXT NOT NULL,
    "inflectionEn" TEXT,
    "solutionPt" TEXT NOT NULL,
    "solutionEn" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "beforeImageUrl" TEXT,
    "beforeImageAlt" TEXT,
    "afterImageUrl" TEXT,
    "afterImageAlt" TEXT,
    "sequence" JSONB DEFAULT '[]',
    "graveyard" JSONB DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timeline_milestones_slug_key" ON "timeline_milestones"("slug");
