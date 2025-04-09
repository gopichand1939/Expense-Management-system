-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "month" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);
