-- AlterTable
ALTER TABLE `User` ADD COLUMN `admin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `overridePluralId` VARCHAR(191) NULL;
