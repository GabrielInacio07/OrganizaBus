/*
  Warnings:

  - You are about to drop the column `alunoId` on the `pagamento` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `pagamento` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `pagamento` table. All the data in the column will be lost.
  - You are about to drop the column `mensalidade` on the `user` table. All the data in the column will be lost.
  - Added the required column `codigo_pix` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pagamentoId` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qr_code` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qr_code_base64` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidade` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pagamento` DROP FOREIGN KEY `Pagamento_alunoId_fkey`;

-- DropIndex
DROP INDEX `Pagamento_alunoId_fkey` ON `pagamento`;

-- AlterTable
ALTER TABLE `pagamento` DROP COLUMN `alunoId`,
    DROP COLUMN `data`,
    DROP COLUMN `tipo`,
    ADD COLUMN `codigo_pix` VARCHAR(191) NOT NULL,
    ADD COLUMN `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `pagamentoId` VARCHAR(191) NOT NULL,
    ADD COLUMN `qr_code` VARCHAR(191) NOT NULL,
    ADD COLUMN `qr_code_base64` VARCHAR(191) NOT NULL,
    ADD COLUMN `quantidade` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `titulo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `mensalidade`;
