/*
  Warnings:

  - You are about to drop the column `userId` on the `Request` table. All the data in the column will be lost.
  - Added the required column `apellidos` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correo` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Request` DROP COLUMN `userId`,
    ADD COLUMN `apellidos` VARCHAR(191) NOT NULL,
    ADD COLUMN `correo` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `telefono` VARCHAR(191) NOT NULL;
