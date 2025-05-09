/*
  Warnings:

  - Added the required column `motoristaId` to the `Aluno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `motoristaId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Aluno` ADD CONSTRAINT `Aluno_motoristaId_fkey` FOREIGN KEY (`motoristaId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
