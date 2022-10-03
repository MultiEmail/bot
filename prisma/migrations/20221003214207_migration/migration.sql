-- CreateEnum
CREATE TYPE "ModerationType" AS ENUM ('Warn', 'Kick', 'Mute', 'Timeout', 'Ban', 'Softban', 'Unmute', 'Unban');

-- CreateTable
CREATE TABLE "Polls" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "Polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Moderation" (
    "id" SERIAL NOT NULL,
    "offenderId" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "messageId" TEXT,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ModerationType" NOT NULL,

    CONSTRAINT "Moderation_pkey" PRIMARY KEY ("id")
);
