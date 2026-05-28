require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function uploadLogo(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).replace('.', '') || 'png';
  const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
  const fileName = `liga-lance.${ext}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, buffer, { contentType: mimeType, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
  return data.publicUrl;
}

async function main() {
  // Procura o arquivo de logo na pasta scripts/
  const extensoes = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
  let logoPath = null;
  for (const ext of extensoes) {
    const p = path.join(__dirname, `lance-logo.${ext}`);
    if (fs.existsSync(p)) { logoPath = p; break; }
  }

  if (!logoPath) {
    console.error('❌ Arquivo de logo não encontrado em scripts/');
    console.error('   Coloque o arquivo como: scripts/lance-logo.png (ou .jpg, .svg)');
    process.exit(1);
  }

  console.log(`📷 Fazendo upload do logo: ${path.basename(logoPath)}`);
  const logoUrl = await uploadLogo(logoPath);
  console.log(`✅ Logo enviado: ${logoUrl}`);

  const ligaExistente = await prisma.liga.findUnique({ where: { nome: 'LANCE!' } });
  if (ligaExistente) {
    // Atualiza o logo se a liga já existe
    await prisma.liga.update({ where: { nome: 'LANCE!' }, data: { logo_url: logoUrl } });
    console.log(`✅ Liga LANCE! atualizada com o logo (id: ${ligaExistente.id})`);
  } else {
    const liga = await prisma.liga.create({ data: { nome: 'LANCE!', logo_url: logoUrl } });
    console.log(`✅ Liga LANCE! criada com sucesso (id: ${liga.id})`);
  }

  console.log('\n🏟  Pronto! Liga LANCE! está configurada.');
  console.log('   Use o painel Admin para adicionar membros à liga.');
}

main()
  .catch((err) => { console.error('Erro:', err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
