-- AlterTable
ALTER TABLE `user` ADD COLUMN `provider` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;
