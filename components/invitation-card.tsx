'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function InvitationCard() {
  const [isVisible, setIsVisible] = useState(false)
  const [cardFront, setCardFront] = useState<string>(
    process.env.NEXT_PUBLIC_CARD_FRONT_IMAGE || process.env.NEXT_PUBLIC_CARD_BACK_IMAGE || '/images/card-front.png'
  )
  const [cardBack, setCardBack] = useState<string>(process.env.NEXT_PUBLIC_CARD_BACK_IMAGE || '/images/card-back.png')

  useEffect(() => {
    setIsVisible(true)

    // รับรูปจาก URL query parameter ถ้ามี
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const frontParam = params.get('cardFront')
      const backParam = params.get('cardBack')

      if (frontParam) setCardFront(decodeURIComponent(frontParam))
      if (backParam) setCardBack(decodeURIComponent(backParam))
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 pb-8 relative z-20">
      <div
        className={`w-full max-w-7xl transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="flex flex-col md:flex-row gap-2 md:gap-2 lg:gap-3">
          {/* <div className="w-full md:w-1/2 flex-shrink-0 flex justify-center items-center">
            <div className="relative rounded-2xl shadow-2xl overflow-visible bg-transparent">
              <div className="relative w-full flex items-center justify-center min-h-[400px]">
                <Image
                  src={cardFront}
                  alt="Invitation Card Front"
                  width={800}
                  height={1131}
                  className="w-full h-auto max-w-full object-contain rounded-2xl"
                  priority
                  style={{ maxHeight: '90vh' }}
                />
              </div>
            </div>
          </div> */}

          <div className="w-full md:w-1/1 flex-shrink-0 flex justify-center items-center">
            <div className="relative rounded-2xl shadow-2xl overflow-visible bg-transparent">
              <div className="relative w-full flex items-center justify-center min-h-[400px]">
                <Image
                  src={cardBack}
                  alt="Invitation Card Back"
                  width={800}
                  height={1131}
                  className="w-full h-auto max-w-full object-contain rounded-2xl select-none"
                  priority
                  style={{ maxHeight: '90vh' }}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
