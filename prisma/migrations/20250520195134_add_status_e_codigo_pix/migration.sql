-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `codigoPix` VARCHAR(191) NULL,
    ADD COLUMN `statusPagamento` VARCHAR(191) NOT NULL DEFAULT 'não gerado';
