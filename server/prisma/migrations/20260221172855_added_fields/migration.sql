-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('SINGLE_LINE', 'MULTI_LINE', 'BOOL', 'NUMERIC');

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fieldType" "FieldType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "stringValue" TEXT,
    "numberValue" INTEGER,
    "booleanValue" BOOLEAN,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InventoryAccess" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_InventoryAccess_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Field_inventoryId_id_idx" ON "Field"("inventoryId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Field_inventoryId_order_key" ON "Field"("inventoryId", "order");

-- CreateIndex
CREATE INDEX "_InventoryAccess_B_index" ON "_InventoryAccess"("B");

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryAccess" ADD CONSTRAINT "_InventoryAccess_A_fkey" FOREIGN KEY ("A") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryAccess" ADD CONSTRAINT "_InventoryAccess_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
