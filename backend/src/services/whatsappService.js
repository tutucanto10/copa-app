const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN    = process.env.ZAPI_TOKEN;
const ZAPI_CLIENT   = process.env.ZAPI_CLIENT_TOKEN;

function formatarTelefone(telefone) {
  // Remove tudo que não é número
  const digits = telefone.replace(/\D/g, '');
  // Garante código do Brasil
  return digits.startsWith('55') ? digits : `55${digits}`;
}

async function enviarMensagem(telefone, mensagem) {
  if (!ZAPI_INSTANCE || !ZAPI_TOKEN || !ZAPI_CLIENT) {
    console.warn('WhatsApp não configurado — defina ZAPI_INSTANCE_ID, ZAPI_TOKEN e ZAPI_CLIENT_TOKEN no .env');
    return;
  }

  const phone = formatarTelefone(telefone);
  const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Token': ZAPI_CLIENT,
    },
    body: JSON.stringify({ phone, message: mensagem }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Z-API erro ${res.status}: ${err}`);
  }

  return res.json();
}

module.exports = { enviarMensagem };
