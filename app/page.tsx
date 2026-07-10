import BodyInvitation from '@/components/body-invitation'
import { getInvitationConfig } from '@/lib/invitation-config'

export const dynamic = 'force-dynamic'

export default function Page() {
  const config = getInvitationConfig()

  return (
    <>
      <BodyInvitation config={config} />
    </>
  )
}
