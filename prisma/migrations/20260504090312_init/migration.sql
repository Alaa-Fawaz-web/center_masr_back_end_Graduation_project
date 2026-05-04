-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "lastMessage" SET DEFAULT '',
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;
