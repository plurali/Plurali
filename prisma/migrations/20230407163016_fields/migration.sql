-- CreateTable
CREATE TABLE `UserField` (
    `id` VARCHAR(191) NOT NULL,
    `pluralId` VARCHAR(191) NOT NULL,
    `pluralOwnerId` VARCHAR(191) NOT NULL,
    `dataId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `UserField_pluralId_key`(`pluralId`),
    UNIQUE INDEX `UserField_dataId_key`(`dataId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserFieldData` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `visible` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserField` ADD CONSTRAINT `UserField_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserField` ADD CONSTRAINT `UserField_dataId_fkey` FOREIGN KEY (`dataId`) REFERENCES `UserFieldData`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
