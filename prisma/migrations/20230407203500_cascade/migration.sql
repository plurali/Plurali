-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_dataId_fkey`;

-- DropForeignKey
ALTER TABLE `UserField` DROP FOREIGN KEY `UserField_dataId_fkey`;

-- DropForeignKey
ALTER TABLE `UserField` DROP FOREIGN KEY `UserField_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserMember` DROP FOREIGN KEY `UserMember_dataId_fkey`;

-- DropForeignKey
ALTER TABLE `UserMember` DROP FOREIGN KEY `UserMember_userId_fkey`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_dataId_fkey` FOREIGN KEY (`dataId`) REFERENCES `UserData`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserField` ADD CONSTRAINT `UserField_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserField` ADD CONSTRAINT `UserField_dataId_fkey` FOREIGN KEY (`dataId`) REFERENCES `UserFieldData`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMember` ADD CONSTRAINT `UserMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMember` ADD CONSTRAINT `UserMember_dataId_fkey` FOREIGN KEY (`dataId`) REFERENCES `UserMemberData`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
