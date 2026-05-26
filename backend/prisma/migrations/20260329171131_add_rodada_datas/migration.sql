-- AlterTable
ALTER TABLE "Rodada" ADD COLUMN     "dataAbertura" TIMESTAMP(3),
ADD COLUMN     "dataFechamento" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PartidaRodada" (
    "id" SERIAL NOT NULL,
    "rodadaId" INTEGER NOT NULL,
    "partidaId" INTEGER NOT NULL,

    CONSTRAINT "PartidaRodada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartidaRodada_rodadaId_partidaId_key" ON "PartidaRodada"("rodadaId", "partidaId");

-- AddForeignKey
ALTER TABLE "PartidaRodada" ADD CONSTRAINT "PartidaRodada_rodadaId_fkey" FOREIGN KEY ("rodadaId") REFERENCES "Rodada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartidaRodada" ADD CONSTRAINT "PartidaRodada_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
