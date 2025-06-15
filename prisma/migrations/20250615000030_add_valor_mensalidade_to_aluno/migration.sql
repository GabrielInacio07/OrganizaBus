-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `temBolsa` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `valorMensalidade` DECIMAL(65, 30) NULL DEFAULT 0.00;
