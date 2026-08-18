-- CreateTable
CREATE TABLE "chat_usage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_usage_ipHash_createdAt_idx" ON "chat_usage"("ipHash", "createdAt");
