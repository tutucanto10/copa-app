const webpush = require('web-push');
const prisma = require('../config/prisma');

let vapidConfigurado = false;
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(
      'mailto:bolao@copa2026.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    vapidConfigurado = true;
  } catch (err) {
    console.warn('VAPID inválido, push desativado:', err.message);
  }
}

async function salvarSubscription(usuarioId, subscription) {
  const { endpoint, keys: { p256dh, auth } } = subscription;
  return prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { usuarioId: Number(usuarioId), p256dh, auth },
    create: { usuarioId: Number(usuarioId), endpoint, p256dh, auth },
  });
}

async function notificarTodos(titulo, corpo, url = '/') {
  if (!vapidConfigurado) return { enviadas: 0, total: 0 };
  const subs = await prisma.pushSubscription.findMany();
  const payload = JSON.stringify({ titulo, corpo, url });
  const resultados = await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      ).catch(async (err) => {
        if (err.statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } });
        }
        throw err;
      })
    )
  );
  const enviadas = resultados.filter((r) => r.status === 'fulfilled').length;
  return { enviadas, total: subs.length };
}

async function notificarUsuario(usuarioId, titulo, corpo, url = '/') {
  if (!vapidConfigurado) return
  const subs = await prisma.pushSubscription.findMany({ where: { usuarioId: Number(usuarioId) } })
  const payload = JSON.stringify({ titulo, corpo, url })
  await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      ).catch(async (err) => {
        if (err.statusCode === 410) await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } })
      })
    )
  )
}

async function notificarResultadoPartida(partida) {
  if (!vapidConfigurado) return
  const { id, placarCasa, placarFora, selecaoCasa, selecaoFora } = partida
  const nomes = `${selecaoCasa.nome} ${placarCasa}×${placarFora} ${selecaoFora.nome}`
  const vencedorReal =
    placarCasa > placarFora ? 'casa' :
    placarFora > placarCasa ? 'fora' : 'empate'

  const apostas = await prisma.aposta.findMany({
    where: { partidaId: id },
    select: { usuarioId: true, placarCasa: true, placarFora: true, vencedor: true },
  })

  const usuariosComAposta = new Set()
  for (const a of apostas) {
    usuariosComAposta.add(a.usuarioId)
    let titulo, corpo
    if (a.placarCasa === placarCasa && a.placarFora === placarFora) {
      titulo = '🎯 Placar exato! +3pts'
      corpo = nomes
    } else if (a.vencedor && a.vencedor === vencedorReal) {
      titulo = '✅ Vencedor certo! +1pt'
      corpo = nomes
    } else {
      titulo = '❌ Errou essa'
      corpo = nomes
    }
    await notificarUsuario(a.usuarioId, titulo, corpo, `/partida/${id}`)
  }

  // Notifica quem não apostou com o resultado apenas
  const todasSubs = await prisma.pushSubscription.findMany({
    where: { usuarioId: { notIn: [...usuariosComAposta] } },
    select: { usuarioId: true },
  })
  const payload = JSON.stringify({ titulo: '⚽ Resultado final', corpo: nomes, url: `/partida/${id}` })
  const subsRestantes = await prisma.pushSubscription.findMany({
    where: { usuarioId: { notIn: [...usuariosComAposta] } },
  })
  await Promise.allSettled(
    subsRestantes.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      ).catch(async (err) => {
        if (err.statusCode === 410) await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } })
      })
    )
  )
}

async function notificarMvpRodada(rodada, mvp) {
  if (!vapidConfigurado) return
  // Notificação especial para o MVP
  await notificarUsuario(
    mvp.usuario.id,
    `🏆 Você é o MVP da Rodada ${rodada}!`,
    `${mvp.pontos} pts nessa rodada. Incrível!`,
    '/'
  )
  // Notificação geral para todos os outros
  const subsOutros = await prisma.pushSubscription.findMany({
    where: { usuarioId: { not: mvp.usuario.id } },
  })
  const payload = JSON.stringify({
    titulo: `🏅 MVP da Rodada ${rodada}`,
    corpo: `${mvp.usuario.nome} dominou com ${mvp.pontos} pts!`,
    url: '/',
  })
  await Promise.allSettled(
    subsOutros.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      ).catch(async (err) => {
        if (err.statusCode === 410) await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } })
      })
    )
  )
}

async function enviarParaSubs(subs, payload) {
  await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      ).catch(async (err) => {
        if (err.statusCode === 410) await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } })
      })
    )
  )
}

async function notificarLembretes() {
  if (!vapidConfigurado) return

  const agora = new Date()

  // Janela 1 — 2h antes do jogo (105–135 min): avisa só quem ainda não apostou
  const min2h = new Date(agora.getTime() + 105 * 60 * 1000)
  const max2h = new Date(agora.getTime() + 135 * 60 * 1000)

  // Janela 2 — 1h antes do jogo (45–75 min): avisa todo mundo (apostas fecham em 30min)
  const min1h = new Date(agora.getTime() + 45 * 60 * 1000)
  const max1h = new Date(agora.getTime() + 75 * 60 * 1000)

  const [partidas2h, partidas1h] = await Promise.all([
    prisma.partida.findMany({
      where: { status: 'AGENDADA', data: { gte: min2h, lte: max2h } },
      include: { selecaoCasa: true, selecaoFora: true },
    }),
    prisma.partida.findMany({
      where: { status: 'AGENDADA', data: { gte: min1h, lte: max1h } },
      include: { selecaoCasa: true, selecaoFora: true },
    }),
  ])

  // ── Lembrete 2h: apenas quem não apostou ainda ──
  for (const partida of partidas2h) {
    const hora = new Date(partida.data).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
    })

    // IDs que já apostaram nessa partida
    const apostas = await prisma.aposta.findMany({
      where: { partidaId: partida.id },
      select: { usuarioId: true },
    })
    const jaApostaram = new Set(apostas.map((a) => a.usuarioId))

    const subs = await prisma.pushSubscription.findMany({
      where: { usuarioId: { notIn: [...jaApostaram] } },
    })
    if (subs.length === 0) continue

    const payload = JSON.stringify({
      titulo: '🎯 Não esquece de apostar!',
      corpo: `${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome} começa às ${hora}. Você ainda não apostou!`,
      url: `/partida/${partida.id}`,
    })
    await enviarParaSubs(subs, payload)
    console.log(`🔔 Lembrete 2h (${hora}) → ${subs.length} sem aposta — ${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome}`)
  }

  // ── Alerta 1h: todo mundo — apostas fecham em 30min ──
  for (const partida of partidas1h) {
    const hora = new Date(partida.data).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
    })

    const subs = await prisma.pushSubscription.findMany()
    if (subs.length === 0) continue

    const payload = JSON.stringify({
      titulo: '⏰ Apostas fecham em 30min!',
      corpo: `${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome} começa às ${hora} — última chance de apostar!`,
      url: `/partida/${partida.id}`,
    })
    await enviarParaSubs(subs, payload)
    console.log(`🔔 Alerta 1h (${hora}) → ${subs.length} usuário(s) — ${partida.selecaoCasa.nome} × ${partida.selecaoFora.nome}`)
  }
}

module.exports = { salvarSubscription, notificarTodos, notificarUsuario, notificarResultadoPartida, notificarMvpRodada, notificarLembretes };
