/*
  Warnings:

  - A unique constraint covering the columns `[pagamentoId]` on the table `Pagamento` will be added. If there are existing duplicate values, this will fail.
  - Made the column `alunoId` on table `pagamento` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `pagamento` DROP FOREIGN KEY `Pagamento_alunoId_fkey`;

-- DropIndex
DROP INDEX `Pagamento_alunoId_fkey` ON `pagamento`;

-- AlterTable
ALTER TABLE `pagamento` MODIFY `alunoId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pagamento_pagamentoId_key` ON `Pagamento`(`pagamentoId`);

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
