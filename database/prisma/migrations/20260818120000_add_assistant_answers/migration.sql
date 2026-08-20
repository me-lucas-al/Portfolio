-- CreateTable
CREATE TABLE "assistant_answers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "locale" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "embedding" vector(1536),
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assistant_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assistant_answers_locale_idx" ON "assistant_answers"("locale");

-- CreateIndex
-- HNSW cannot be expressed via Prisma's @@index (only Gin/Gist/Hash/SpGist/Brin), so it is added by raw SQL here.
CREATE INDEX "assistant_answers_embedding_hnsw_idx" ON "assistant_answers" USING hnsw ("embedding" vector_cosine_ops) WITH (m = 16, ef_construction = 64);
