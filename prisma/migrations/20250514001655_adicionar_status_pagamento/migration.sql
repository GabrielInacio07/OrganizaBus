-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `codigoPix` VARCHAR(191) NULL,
    ADD COLUMN `imagemPix` LONGTEXT NULL,
    ADD COLUMN `statusPagamento` VARCHAR(191) NULL DEFAULT 'não gerado';
