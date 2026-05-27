const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { realtime: { transport: ws } }
)

async function uploadFoto(usuarioId, base64String) {
  const match = base64String.match(/^data:(.+);base64,(.+)$/)
  if (!match) throw new Error('Formato de imagem inválido')

  const [, mimeType, base64Data] = match
  const ext = mimeType.split('/')[1]?.split(';')[0] || 'jpg'
  const buffer = Buffer.from(base64Data, 'base64')
  const fileName = `avatar-${usuarioId}.${ext}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, buffer, { contentType: mimeType, upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
  return data.publicUrl
}

module.exports = { supabase, uploadFoto }
