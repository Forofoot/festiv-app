/*
  Warnings:

  - You are about to drop the column `avatar` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `avatarPublicId` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `avatar`,
    DROP COLUMN `avatarPublicId`,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `imagePublicId` VARCHAR(191) NULL;
