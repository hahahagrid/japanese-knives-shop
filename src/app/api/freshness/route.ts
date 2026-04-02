import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    draft: false,
  })

  return Response.json({
    version: settings.contentVersion || 'init',
  })
}
