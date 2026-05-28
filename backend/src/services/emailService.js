const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
});

async function enviarEmail(destinatario, assunto, html) {
  if (!process.env.EMAIL_SMTP_USER || !process.env.EMAIL_SMTP_PASS) {
    console.warn('Email não configurado — defina EMAIL_SMTP_USER e EMAIL_SMTP_PASS no .env');
    return;
  }

  await transporter.sendMail({
    from: `"Bolão Copa 2026" <${process.env.EMAIL_SMTP_USER}>`,
    to: destinatario,
    subject: assunto,
    html,
  });
}

async function enviarSenhaTemporaria(nome, email, tempSenha) {
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0a0e1a;padding:2rem;border-radius:12px;color:#f0f4ff;">
      <div style="text-align:center;margin-bottom:1.5rem;">
        <h1 style="color:#00a651;letter-spacing:4px;margin:0;font-size:1.8rem;">BOLÃO</h1>
        <p style="color:#8b9bb4;margin:4px 0 0;">Copa 2026</p>
      </div>

      <p style="color:#f0f4ff;">Olá, <strong>${nome}</strong>!</p>
      <p style="color:#8b9bb4;">Recebemos uma solicitação de redefinição de senha para sua conta. Sua senha temporária é:</p>

      <div style="background:#1a1200;border:1px solid #f5d000;border-radius:10px;padding:1.25rem;text-align:center;margin:1.5rem 0;">
        <span style="font-size:2rem;font-weight:700;letter-spacing:6px;color:#f5d000;">${tempSenha}</span>
      </div>

      <p style="color:#8b9bb4;font-size:0.85rem;">
        Entre no app com essa senha e troque por uma nova no seu perfil assim que possível.
      </p>

      <hr style="border:none;border-top:1px solid #1e2d45;margin:1.5rem 0;" />
      <p style="color:#8b9bb4;font-size:0.75rem;text-align:center;">
        Se você não solicitou isso, ignore este email. Sua senha atual permanece ativa.
      </p>
    </div>
  `;

  await enviarEmail(email, '🔐 Sua senha temporária — Bolão Copa 2026', html);
}

module.exports = { enviarSenhaTemporaria };
