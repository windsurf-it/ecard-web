import { notFound } from 'next/navigation'
import BodyInvitation from '@/components/body-invitation'
import { getInvitationConfig } from '@/lib/invitation-config'
import { isValidEncryptedName } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params

  if (!isValidEncryptedName(name)) {
    notFound()
  }

  const config = getInvitationConfig()

  return (
    <>
      <BodyInvitation encryptedName={name} config={config} />
    </>
  )
}
