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

module.exports = { salvarSubscription, notificarTodos };
