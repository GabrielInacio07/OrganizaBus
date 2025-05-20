/*
  Warnings:

  - You are about to drop the column `codigoPix` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `statusPagamento` on the `aluno` table. All the data in the column will be lost.
  - Added the required column `tipo` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno` DROP COLUMN `codigoPix`,
    DROP COLUMN `statusPagamento`;

-- AlterTable
ALTER TABLE `pagamento` ADD COLUMN `tipo` VARCHAR(191) NOT NULL;
