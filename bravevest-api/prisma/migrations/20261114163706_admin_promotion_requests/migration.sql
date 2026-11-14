-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "admin_promotion_requests" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "PromotionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_promotion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_promotion_requests_status_idx" ON "admin_promotion_requests"("status");

-- CreateIndex
CREATE INDEX "admin_promotion_requests_candidateId_idx" ON "admin_promotion_requests"("candidateId");

-- CreateIndex
CREATE INDEX "admin_promotion_requests_requestedById_idx" ON "admin_promotion_requests"("requestedById");

-- AddForeignKey
ALTER TABLE "admin_promotion_requests" ADD CONSTRAINT "admin_promotion_requests_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_promotion_requests" ADD CONSTRAINT "admin_promotion_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_promotion_requests" ADD CONSTRAINT "admin_promotion_requests_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
