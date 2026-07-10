import BodyInvitation from '@/components/body-invitation'

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params

  return (
    <>
      <BodyInvitation encryptedName={name} />
    </>
  )
}
