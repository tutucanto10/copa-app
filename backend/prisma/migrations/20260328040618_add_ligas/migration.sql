-- CreateTable
CREATE TABLE "Liga" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Liga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembroLiga" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ligaId" INTEGER NOT NULL,

    CONSTRAINT "MembroLiga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Liga_nome_key" ON "Liga"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "MembroLiga_usuarioId_ligaId_key" ON "MembroLiga"("usuarioId", "ligaId");

-- AddForeignKey
ALTER TABLE "MembroLiga" ADD CONSTRAINT "MembroLiga_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembroLiga" ADD CONSTRAINT "MembroLiga_ligaId_fkey" FOREIGN KEY ("ligaId") REFERENCES "Liga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
