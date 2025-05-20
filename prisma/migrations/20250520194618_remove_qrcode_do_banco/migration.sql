/*
  Warnings:

  - You are about to drop the column `qr_code_base64` on the `pagamento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pagamento` DROP COLUMN `qr_code_base64`;
