-- CreateTable
CREATE TABLE "ApostaGoleador" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "partidaId" INTEGER NOT NULL,
    "jogadorId" INTEGER NOT NULL,

    CONSTRAINT "ApostaGoleador_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApostaGoleador" ADD CONSTRAINT "ApostaGoleador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApostaGoleador" ADD CONSTRAINT "ApostaGoleador_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApostaGoleador" ADD CONSTRAINT "ApostaGoleador_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
