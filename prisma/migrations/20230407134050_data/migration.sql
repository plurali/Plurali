/*
  Warnings:

  - You are about to drop the column `customDescription` on the `UserMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dataId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dataId]` on the table `UserMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pluralOwnerId` to the `UserMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `dataId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `UserMember` DROP COLUMN `customDescription`,
    ADD COLUMN `dataId` VARCHAR(191) NULL,
    ADD COLUMN `pluralOwnerId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `UserData` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMemberData` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_dataId_key` ON `User`(`dataId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserMember_dataId_key` ON `UserMember`(`dataId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_dataId_fkey` FOREIGN KEY (`dataId`) REFERENCES `UserData`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMember` ADD CONSTRAINT `UserMember_dataId_fkey` FOREIGN KEY (`dataId`) REFERENCES `UserMemberData`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
