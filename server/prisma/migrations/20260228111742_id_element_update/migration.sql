-- DropForeignKey
ALTER TABLE "IdElement" DROP CONSTRAINT "IdElement_idConfigId_fkey";

-- AddForeignKey
ALTER TABLE "IdElement" ADD CONSTRAINT "IdElement_idConfigId_fkey" FOREIGN KEY ("idConfigId") REFERENCES "IdConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
