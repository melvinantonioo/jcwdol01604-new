/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `property` ADD COLUMN `slug` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Property_slug_key` ON `Property`(`slug`);
