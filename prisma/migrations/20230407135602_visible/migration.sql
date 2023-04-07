/*
  Warnings:

  - Added the required column `visible` to the `UserData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visible` to the `UserMemberData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserData` ADD COLUMN `visible` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `UserMemberData` ADD COLUMN `visible` BOOLEAN NOT NULL;
