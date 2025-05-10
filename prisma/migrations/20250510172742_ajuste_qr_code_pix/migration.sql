-- AlterTable
ALTER TABLE `pagamento` ADD COLUMN `alunoId` INTEGER NULL,
    MODIFY `qr_code_base64` LONGTEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
