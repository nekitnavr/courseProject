/*
  Warnings:

  - You are about to drop the column `booleanValue` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `numberValue` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `stringValue` on the `Field` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Field" DROP COLUMN "booleanValue",
DROP COLUMN "numberValue",
DROP COLUMN "stringValue";
