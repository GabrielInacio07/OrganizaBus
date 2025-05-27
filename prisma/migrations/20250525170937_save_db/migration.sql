/*
  Warnings:

  - Added the required column `expiraEm` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pagamento` ADD COLUMN `expiraEm` DATETIME(3) NOT NULL,
    MODIFY `valor` DECIMAL(65, 30) NOT NULL;
