require('dotenv').config()
const prisma = require('../src/config/prisma')

const SEMIS = [
  { casaNome: 'França',     foraNome: 'Espanha',   dataUTC: '2026-07-14T19:00:00Z' },
  { casaNome: 'Inglaterra', foraNome: 'Argentina', dataUTC: '2026-07-15T19:00:00Z' },
]

async function main() {
  // ── 1. Corrige placares + vencedorKO das quartas ──
  console.log('=== Corrigindo Quartas ===')

  // França 2×0 Marrocos — placar correto, só setar vencedorKO
  await prisma.partida.update({ where: { id: 169 }, data: { vencedorKO: 'casa' } })
  console.log('  ✅ 169 França 2×0 Marrocos — vencedorKO=casa')

  // Espanha 2×1 Bélgica — placar correto, só setar vencedorKO
  await prisma.partida.update({ where: { id: 170 }, data: { vencedorKO: 'casa' } })
  console.log('  ✅ 170 Espanha 2×1 Bélgica — vencedorKO=casa')

  // Noruega × Inglaterra: era 1×2 no banco (ERRADO) → corrige para 1×1 + Inglaterra avança
  await prisma.partida.update({ where: { id: 171 }, data: { placarCasa: 1, placarFora: 1, vencedorKO: 'fora' } })
  console.log('  ✅ 171 Noruega 1×1 Inglaterra (AET/PEN) — placar corrigido, vencedorKO=fora')

  // Argentina × Suíça: era 3×1 no banco (ERRADO) → corrige para 1×1 + Argentina avança
  await prisma.partida.update({ where: { id: 172 }, data: { placarCasa: 1, placarFora: 1, vencedorKO: 'casa' } })
  console.log('  ✅ 172 Argentina 1×1 Suíça (AET/PEN) — placar corrigido, vencedorKO=casa')

  // ── 2. Cria Semifinais (rodada 7) ──
  console.log('\n=== Criando Semifinais (rodada 7) ===')
  const selecoes = await prisma.selecao.findMany()
  const find = (nome) => selecoes.find(s => s.nome === nome)

  for (const { casaNome, foraNome, dataUTC } of SEMIS) {
    const selCasa = find(casaNome)
    const selFora = find(foraNome)
    if (!selCasa) { console.log(`  ❌ Seleção não encontrada: ${casaNome}`); continue }
    if (!selFora) { console.log(`  ❌ Seleção não encontrada: ${foraNome}`); continue }

    const existe = await prisma.partida.findFirst({
      where: { rodada: 7, selecaoCasaId: selCasa.id, selecaoForaId: selFora.id },
    })
    if (existe) { console.log(`  ⚠️  Já existe: ${casaNome} x ${foraNome} (ID ${existe.id})`); continue }

    const criada = await prisma.partida.create({
      data: { selecaoCasaId: selCasa.id, selecaoForaId: selFora.id, data: new Date(dataUTC), rodada: 7, status: 'AGENDADA' },
      include: { selecaoCasa: true, selecaoFora: true },
    })
    const brDate = new Date(dataUTC).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    })
    console.log(`  ✅ ${criada.selecaoCasa.nome} x ${criada.selecaoFora.nome} — ${brDate} BRT (ID ${criada.id})`)
  }

  console.log('\n🎉 Concluído!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
