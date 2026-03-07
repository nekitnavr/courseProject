/*
  Warnings:

  - A unique constraint covering the columns `[inventoryId,fieldType,slotNumber]` on the table `Field` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display` to the `Field` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotNumber` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "display" BOOLEAN NOT NULL,
ADD COLUMN     "slotNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "customId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "singleLine1" TEXT,
    "singleLine2" TEXT,
    "singleLine3" TEXT,
    "multiLine1" TEXT,
    "multiLine2" TEXT,
    "multiLine3" TEXT,
    "numeric1" INTEGER,
    "numeric2" INTEGER,
    "numeric3" INTEGER,
    "bool1" BOOLEAN DEFAULT false,
    "bool2" BOOLEAN DEFAULT false,
    "bool3" BOOLEAN DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_inventoryId_customId_key" ON "Item"("inventoryId", "customId");

-- CreateIndex
CREATE UNIQUE INDEX "Field_inventoryId_fieldType_slotNumber_key" ON "Field"("inventoryId", "fieldType", "slotNumber");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
