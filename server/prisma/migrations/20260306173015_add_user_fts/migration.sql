-- DropForeignKey
ALTER TABLE "IdConfig" DROP CONSTRAINT "IdConfig_inventoryId_fkey";

-- AddForeignKey
ALTER TABLE "IdConfig" ADD CONSTRAINT "IdConfig_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

--Add GIN index for name and email of User
CREATE INDEX user_fts_idx ON "User" USING gin(to_tsvector('english', name || ' ' || email));