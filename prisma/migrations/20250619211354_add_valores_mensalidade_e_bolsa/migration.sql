/*
  Warnings:

  - You are about to drop the column `temBolsa` on the `aluno` table. All the data in the column will be lost.
  - Made the column `valorMensalidade` on table `aluno` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `aluno` DROP COLUMN `temBolsa`,
    ADD COLUMN `possuiBolsa` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `valorBolsa` DOUBLE NULL,
    MODIFY `valorMensalidade` DOUBLE NOT NULL;
