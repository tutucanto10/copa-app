/*
  Warnings:

  - Made the column `posicao` on table `Jogador` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "StatusRodada" AS ENUM ('ABERTA', 'FECHADA');

-- AlterTable
ALTER TABLE "Jogador" ADD COLUMN     "preco" DOUBLE PRECISION NOT NULL DEFAULT 6,
ALTER COLUMN "posicao" SET NOT NULL;

-- AlterTable
ALTER TABLE "Partida" ADD COLUMN     "rodada" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Rodada" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "status" "StatusRodada" NOT NULL DEFAULT 'ABERTA',

    CONSTRAINT "Rodada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeFantasy" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "rodadaId" INTEGER NOT NULL,
    "formacao" TEXT NOT NULL,
    "capitaoId" INTEGER,
    "patrimonio" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "pontos" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "TimeFantasy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscalacaoJogador" (
    "id" SERIAL NOT NULL,
    "timeFantasyId" INTEGER NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "titular" BOOLEAN NOT NULL DEFAULT true,
    "pontosGanhos" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "EscalacaoJogador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rodada_numero_key" ON "Rodada"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "TimeFantasy_usuarioId_rodadaId_key" ON "TimeFantasy"("usuarioId", "rodadaId");

-- AddForeignKey
ALTER TABLE "TimeFantasy" ADD CONSTRAINT "TimeFantasy_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeFantasy" ADD CONSTRAINT "TimeFantasy_rodadaId_fkey" FOREIGN KEY ("rodadaId") REFERENCES "Rodada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalacaoJogador" ADD CONSTRAINT "EscalacaoJogador_timeFantasyId_fkey" FOREIGN KEY ("timeFantasyId") REFERENCES "TimeFantasy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalacaoJogador" ADD CONSTRAINT "EscalacaoJogador_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
