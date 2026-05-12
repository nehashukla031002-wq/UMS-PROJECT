/*
  Warnings:

  - The values [SUSPENDED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updatedAt` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('ACTIVE', 'BLOCKED');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user2Id_fkey";

-- DropIndex
DROP INDEX "GroupMessage_createdAt_idx";

-- DropIndex
DROP INDEX "GroupMessage_userId_idx";

-- DropIndex
DROP INDEX "Message_createdAt_idx";

-- DropIndex
DROP INDEX "Message_isRead_idx";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "updatedAt",
ALTER COLUMN "avatar" SET DEFAULT 'default-group.png';

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" SET DEFAULT 'default-avatar.png';

-- DropTable
DROP TABLE "Conversation";
