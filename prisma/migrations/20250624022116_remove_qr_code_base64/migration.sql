/*
  Warnings:

  - You are about to drop the column `qr_code_base64` on the `pagamento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pagamento` DROP COLUMN `qr_code_base64`,
    MODIFY `codigo_pix` VARCHAR(191) NULL,
    MODIFY `qr_code` VARCHAR(191) NULL;
