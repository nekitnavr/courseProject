/*
  Warnings:

  - You are about to drop the column `customId` on the `Inventory` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "IdElementType" AS ENUM ('TEXT', 'RANDOM_20_BIT', 'RANDOM_32_BIT', 'RANDOM_6_DIGIT', 'RANDOM_9_DIGIT', 'GUID', 'DATE', 'SEQUENCE');

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "customId",
ADD COLUMN     "customItemIdSequence" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "IdConfig" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "separator" TEXT DEFAULT '',

    CONSTRAINT "IdConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdElement" (
    "id" SERIAL NOT NULL,
    "idConfigId" TEXT NOT NULL,
    "idElementType" "IdElementType" NOT NULL,
    "fixedText" TEXT,

    CONSTRAINT "IdElement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdConfig_inventoryId_key" ON "IdConfig"("inventoryId");

-- AddForeignKey
ALTER TABLE "IdConfig" ADD CONSTRAINT "IdConfig_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdElement" ADD CONSTRAINT "IdElement_idConfigId_fkey" FOREIGN KEY ("idConfigId") REFERENCES "IdConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
