/*
  Warnings:

  - Added the required column `atualizadoEm` to the `Aluno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `atualizadoEm` DATETIME(3) NOT NULL,
    ADD COLUMN `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
