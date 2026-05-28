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

module.exports = { salvarSubscription, notificarTodos, notificarUsuario, notificarResultadoPartida, notificarMvpRodada };
