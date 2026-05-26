/**
 * automacao.js — Processo contínuo 24/7.
 * Gerencia status das partidas e abertura/fechamento de rodadas.
 * A pontuação é calculada dinamicamente pelo rankingService.
 *
 * Uso: pm2 start scripts/automacao.js --name automacao
 *      node scripts/automacao.js  (para testar manualmente)
 *
 * Intervalo: a cada 60 segundos.
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Duração estimada: 90 min de jogo + 15 min de tolerância
const DURACAO_PARTIDA_MS = 105 * 60 * 1000

// ─── ATUALIZAÇÃO DE STATUS DAS PARTIDAS ──────────────────────────────────────

async function atualizarStatusPartidas() {
  const agora = new Date()

  const partidas = await prisma.partida.findMany({
    where: { status: { in: ['AGENDADA', 'AO_VIVO'] } },
    select: { id: true, data: true, status: true },
  })

  for (const p of partidas) {
    const inicio = new Date(p.data)
    const fim    = new Date(inicio.getTime() + DURACAO_PARTIDA_MS)

    if (p.status === 'AGENDADA' && agora >= inicio) {
      await prisma.partida.update({ where: { id: p.id }, data: { status: 'AO_VIVO' } })
      console.log(`[${ts()}] AO_VIVO    partida #${p.id}`)
    }

    if (p.status === 'AO_VIVO' && agora >= fim) {
      await prisma.partida.update({ where: { id: p.id }, data: { status: 'FINALIZADA' } })
      console.log(`[${ts()}] FINALIZADA partida #${p.id}`)
    }
  }
}

// ─── GERENCIAR ABERTURA/FECHAMENTO DE RODADAS ─────────────────────────────────

async function gerenciarRodadas() {
  const agora   = new Date()
  const rodadas = await prisma.rodada.findMany()

  for (const r of rodadas) {
    if (!r.dataFechamento) continue

    const deveFechar = agora >= r.dataFechamento
    const novoStatus = deveFechar ? 'FECHADA' : 'ABERTA'

    if (r.status !== novoStatus) {
      await prisma.rodada.update({ where: { id: r.id }, data: { status: novoStatus } })
      console.log(`[${ts()}] Rodada ${r.numero} → ${novoStatus}`)
    }
  }
}

// ─── LOOP PRINCIPAL ───────────────────────────────────────────────────────────

function ts() {
  return new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })
}

async function tick() {
  try {
    await atualizarStatusPartidas()
    await gerenciarRodadas()
  } catch (err) {
    console.error(`[${ts()}] Erro no tick:`, err.message)
  }
}

async function main() {
  console.log('🤖 Automação Copa 2026 iniciada')
  console.log(`   Horário: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} (Brasília)`)
  console.log('   Intervalo: 60s\n')

  await tick()
  setInterval(tick, 60 * 1000)
}

main().catch((err) => {
  console.error('💥 Erro fatal:', err)
  process.exit(1)
})
