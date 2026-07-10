import { notFound } from 'next/navigation'
import BodyInvitation from '@/components/body-invitation'
import { getInvitationConfig } from '@/lib/invitation-config'
import { decryptBase64 } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params

  if (!decryptBase64(name)) {
    notFound()
  }

  const config = getInvitationConfig()

  return (
    <>
      <BodyInvitation encryptedName={name} config={config} />
    </>
  )
}
