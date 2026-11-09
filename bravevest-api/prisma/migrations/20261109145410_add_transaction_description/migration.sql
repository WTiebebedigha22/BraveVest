-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "investments_userId_status_idx" ON "investments"("userId", "status");

-- CreateIndex
CREATE INDEX "investments_createdAt_idx" ON "investments"("createdAt");

-- CreateIndex
CREATE INDEX "projects_category_status_idx" ON "projects"("category", "status");

-- CreateIndex
CREATE INDEX "projects_status_createdAt_idx" ON "projects"("status", "createdAt");
