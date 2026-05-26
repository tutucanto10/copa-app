-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AGENDADA', 'AO_VIVO', 'FINALIZADA');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('GOL', 'ASSISTENCIA', 'AMARELO', 'VERMELHO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Selecao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "escudo_url" TEXT,

    CONSTRAINT "Selecao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "posicao" TEXT,
    "selecaoId" INTEGER NOT NULL,

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" SERIAL NOT NULL,
    "selecaoCasaId" INTEGER NOT NULL,
    "selecaoForaId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "placarCasa" INTEGER NOT NULL DEFAULT 0,
    "placarFora" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'AGENDADA',

    CONSTRAINT "Partida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "partidaId" INTEGER NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "tipo" "TipoEvento" NOT NULL,
    "minuto" INTEGER NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aposta" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "partidaId" INTEGER NOT NULL,
    "placarCasa" INTEGER NOT NULL,
    "placarFora" INTEGER NOT NULL,

    CONSTRAINT "Aposta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Jogador" ADD CONSTRAINT "Jogador_selecaoId_fkey" FOREIGN KEY ("selecaoId") REFERENCES "Selecao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_selecaoCasaId_fkey" FOREIGN KEY ("selecaoCasaId") REFERENCES "Selecao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_selecaoForaId_fkey" FOREIGN KEY ("selecaoForaId") REFERENCES "Selecao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aposta" ADD CONSTRAINT "Aposta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aposta" ADD CONSTRAINT "Aposta_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
