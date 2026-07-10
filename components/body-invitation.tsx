'use client'

import { useState, useRef, useEffect } from 'react'
import { EnvelopeSection } from './envelope-section'
import CardInvitation from './card-invitation'
import { GallerySection } from './gallery-section'
import { VinylPlayer, type VinylPlayerRef } from './vinyl-player'
import { CoupleSection } from './couple-section'

const MAP_LINK = process.env.NEXT_PUBLIC_MAP_LINK || '#'
const PROMPTPAY_ACCOUNT_NAME = process.env.NEXT_PUBLIC_PROMPTPAY_ACCOUNT_NAME || 'ใส่ชื่อบัญชีของคุณ'

function seededRandom(seed: number) {
  let value = seed
  return function () {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

interface FallenLeaf {
  id: number
  left: number
  imageIndex: number
  hueRotate: number
  brightness: number
  rotation: number
  size: number
}

export default function BodyInvitation() {
  const [isOpen, setIsOpen] = useState(false)
  const vinylPlayerRef = useRef<VinylPlayerRef>(null)
  const [fallenLeaves, setFallenLeaves] = useState<FallenLeaf[]>([])
  const leafIdCounter = useRef(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showPromptPayModal, setShowPromptPayModal] = useState(false)
  const [promptPayQrLoaded, setPromptPayQrLoaded] = useState(false)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    for (let i = 0; i < 20; i++) {
      const random = seededRandom(i * 1000 + 12345)
      const left = random() * 100
      const animationDelay = random() * 12
      const animationDuration = 8 + random() * 7
      const imageIndex = Math.floor(random() * mapleLeafImages.length)
      const hueRotate = random() * 30 - 15
      const brightness = 0.9 + random() * 0.2
      const rotation = random() * 360

      const fallTime = (animationDelay + animationDuration) * 1000

      const timer = setTimeout(() => {
        const finalRandom = seededRandom(i * 1000 + 12345)
        const newLeaf: FallenLeaf = {
          id: leafIdCounter.current++,
          left: left,
          imageIndex: imageIndex,
          hueRotate: hueRotate,
          brightness: brightness,
          rotation: rotation + finalRandom() * 360,
          size: 0.8 + finalRandom() * 0.4
        }
        setFallenLeaves((prev) => [...prev, newLeaf])
      }, fallTime)

      timers.push(timer)
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  const mapleLeafImages = [
    '/transparent-maple-leaf-orange.png',
    '/transparent-maple-leaf-red.png',
    '/transparent-maple-leaf-yellow.png',
    '/transparent-maple-leaf-brown.png'
  ]

  useEffect(() => {
    const imagesToLoad = ['/bg-autumnal.jpg', ...mapleLeafImages]

    let loadedCount = 0
    const totalImages = imagesToLoad.length

    const handleImageLoad = () => {
      loadedCount++
      const progress = Math.round((loadedCount / totalImages) * 100)
      setLoadingProgress(progress)

      if (loadedCount === totalImages) {
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }
    }

    const imagePromises = imagesToLoad.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          handleImageLoad()
          resolve()
        }
        img.onerror = () => {
          handleImageLoad()
          resolve()
        }
        img.src = src
      })
    })

    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const handleEnvelopeClick = () => {
    if (vinylPlayerRef.current) {
      vinylPlayerRef.current.play()
    }
  }

  return (
    <main className="min-h-screen overflow-hidden relative">
      {isLoading && (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#FFF0F5] via-[#F5FDF9] to-[#FFF8F0] flex items-center justify-center">
          <div className="absolute inset-0 opacity-[0.8]">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/bg-autumnal.jpg')"
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <div className="absolute inset-0 border-4 border-[#D4AF37]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-[#D4AF37] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#FFD700] via-[#D4AF37] to-[#B8860B] opacity-80 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2
                className="text-xl md:text-2xl font-serif text-[#8B4513] mb-2"
                style={{
                  fontFamily: 'var(--font-serif)'
                }}
              >
                Loading...
              </h2>
              <p className="text-sm md:text-base text-[#5C4033]/70 font-serif">กรุณารอสักครู่</p>
            </div>

            <div className="w-48 md:w-64 h-1.5 bg-[#E8D5B7]/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] transition-all duration-300 ease-out"
                style={{
                  width: `${loadingProgress}%`
                }}
              />
            </div>

            <p className="text-xs md:text-sm text-[#8B4513]/60 font-serif">{loadingProgress}%</p>
          </div>

          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-radial from-[#FFB6C1]/10 via-transparent to-transparent blur-2xl opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-radial from-[#C8E6D5]/10 via-transparent to-transparent blur-2xl opacity-50" />
        </div>
      )}
      {!isOpen && (
        <div className="fixed top-0 left-0 right-0 z-30 pt-16 md:pt-20 lg:pt-24 xl:pt-28 px-4 pointer-events-none">
          <div className="max-w-7xl mx-auto">
            <div className="relative flex flex-col items-center justify-center space-y-3 md:space-y-4 animate-fadeIn">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 md:-translate-y-6 w-full max-w-3xl pointer-events-none">
                <svg className="w-full h-12 md:h-16 lg:h-20 opacity-30" viewBox="0 0 500 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="goldGradientTopHeader" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#FFD700" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,40 Q125,15 250,40 T500,40"
                    stroke="url(#goldGradientTopHeader)"
                    strokeWidth="1.5"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                  <path
                    d="M0,40 Q125,20 250,40 T500,40"
                    stroke="url(#goldGradientTopHeader)"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>

                <div className="absolute top-2 md:top-3 left-[12%] opacity-25">
                  <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 100 100">
                    <path d="M50,15 Q40,30 50,45 Q60,30 50,15" fill="#D4AF37" opacity="0.4" />
                    <path d="M50,45 L45,60 L50,70 L55,60 Z" fill="#D4AF37" opacity="0.3" />
                    <path d="M50,45 L48,55 L50,60 L52,55 Z" fill="#FFD700" opacity="0.2" />
                  </svg>
                </div>
                <div className="absolute top-4 md:top-6 right-[12%] opacity-20">
                  <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 100 100">
                    <path d="M50,15 Q40,30 50,45 Q60,30 50,15" fill="#D4AF37" opacity="0.4" />
                    <path d="M50,45 L45,60 L50,70 L55,60 Z" fill="#D4AF37" opacity="0.3" />
                  </svg>
                </div>
                <div className="absolute top-1 md:top-2 left-[45%] opacity-15">
                  <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 100 100">
                    <path d="M50,20 Q45,30 50,40 Q55,30 50,20" fill="#D4AF37" opacity="0.3" />
                  </svg>
                </div>
              </div>

              <div className="relative z-10">
                <h1
                  className="md:hidden text-4xl sm:text-5xl font-serif font-bold text-center leading-[0.95] tracking-tight"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700
                  }}
                >
                  <span
                    className="block text-[#2C2C2C] relative"
                    style={{
                      letterSpacing: '-0.03em',
                      textShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    WELCOME
                    <span className="absolute -top-1 -right-3 text-[#D4AF37] opacity-20 text-xl font-light">❦</span>
                  </span>
                  <span
                    className="block text-[#2C2C2C] mt-1 relative"
                    style={{
                      letterSpacing: '-0.03em',
                      textShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    TO OUR
                  </span>
                  <span
                    className="block text-[#2C2C2C] mt-1 relative"
                    style={{
                      letterSpacing: '-0.03em',
                      textShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    NEW HOME
                    <span className="absolute -bottom-1 -left-3 text-[#D4AF37] opacity-20 text-xl font-light">❦</span>
                  </span>
                </h1>

                <h1
                  className="hidden md:flex items-center justify-center gap-2 lg:gap-3 text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-serif font-bold leading-none tracking-tight"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700
                  }}
                >
                  <span
                    className="text-[#2C2C2C] relative"
                    style={{
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    WELCOME
                    <span className="absolute -top-0.5 -right-3 lg:-right-4 text-[#D4AF37] opacity-20 text-sm lg:text-base font-light">
                      ❦
                    </span>
                  </span>
                  <span
                    className="text-[#2C2C2C]"
                    style={{
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    TO OUR
                  </span>
                  <span
                    className="text-[#2C2C2C] relative"
                    style={{
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    NEW HOME
                    <span className="absolute -bottom-0.5 -left-3 lg:-left-4 text-[#D4AF37] opacity-20 text-sm lg:text-base font-light">
                      ❦
                    </span>
                  </span>
                </h1>

                <div className="flex items-center justify-center gap-3 md:gap-3 lg:gap-4 mt-4 sm:mt-5 md:mt-3 lg:mt-4">
                  <div className="h-px w-12 sm:w-16 md:w-16 lg:w-20 xl:w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFD700] opacity-50" />
                  <div className="relative">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-gradient-to-br from-[#FFD700] via-[#D4AF37] to-[#B8860B] opacity-60 shadow-sm" />
                    <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#FFD700] opacity-20 animate-pulse" />
                  </div>
                  <div className="h-px w-12 sm:w-16 md:w-16 lg:w-20 xl:w-24 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFD700] opacity-50" />
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 md:translate-y-10 lg:translate-y-12 w-full max-w-3xl pointer-events-none">
                <svg className="w-full h-12 md:h-16 lg:h-20 opacity-30" viewBox="0 0 500 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="goldGradientBottomHeader" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#FFD700" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,40 Q125,65 250,40 T500,40"
                    stroke="url(#goldGradientBottomHeader)"
                    strokeWidth="1.5"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                  <path
                    d="M0,40 Q125,60 250,40 T500,40"
                    stroke="url(#goldGradientBottomHeader)"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>

                <div className="absolute bottom-2 md:bottom-3 left-[18%] opacity-25">
                  <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 100 100">
                    <path d="M50,15 Q40,30 50,45 Q60,30 50,15" fill="#D4AF37" opacity="0.4" />
                    <path d="M50,45 L45,60 L50,70 L55,60 Z" fill="#D4AF37" opacity="0.3" />
                  </svg>
                </div>
                <div className="absolute bottom-4 md:bottom-6 right-[18%] opacity-30">
                  <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 100 100">
                    <path d="M50,15 Q40,30 50,45 Q60,30 50,15" fill="#D4AF37" opacity="0.4" />
                    <path d="M50,45 L45,60 L50,70 L55,60 Z" fill="#D4AF37" opacity="0.3" />
                    <path d="M50,45 L48,55 L50,60 L52,55 Z" fill="#FFD700" opacity="0.2" />
                  </svg>
                </div>
                <div className="absolute bottom-1 md:bottom-2 right-[45%] opacity-15">
                  <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 100 100">
                    <path d="M50,20 Q45,30 50,40 Q55,30 50,20" fill="#D4AF37" opacity="0.3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF0F5] via-[#F5FDF9] to-[#FFF8F0]" />

        <div className="absolute inset-0 opacity-[0.8]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/bg-autumnal.jpg')"
            }}
          />
        </div>

        <div className="absolute top-0 left-0 w-full h-2/5 bg-gradient-to-b from-[#FFE5F1]/40 via-[#FFF0F8]/25 to-transparent" />
        <div className="absolute bottom-0 right-0 w-5/5 h-2/5 bg-gradient-to-t from-[#E8F8F0]/35 via-[#F0FDF8]/20 to-transparent" />

        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#FFB6C1]/12 via-[#FFE4E1]/6 to-transparent blur-3xl opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#C8E6D5]/15 via-[#E8F5ED]/8 to-transparent blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-radial from-[#FFD1DC]/10 via-[#FFE8ED]/5 to-transparent blur-2xl opacity-40" />
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => {
          const random = seededRandom(i * 1000 + 12345)
          const left = random() * 100
          const animationDelay = random() * 12
          const animationDuration = 8 + random() * 7
          const imageIndex = Math.floor(random() * mapleLeafImages.length)
          const hueRotate = random() * 30 - 15
          const brightness = 0.9 + random() * 0.2
          const rotation = random() * 360

          return (
            <div
              key={`falling-${i}`}
              className="absolute animate-mapleFall"
              style={{
                left: `${left}%`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`,
                transform: `rotate(${rotation}deg)`
              }}
            >
              <img
                src={mapleLeafImages[imageIndex] || '/placeholder.svg'}
                alt=""
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 opacity-60"
                style={{
                  filter: `hue-rotate(${hueRotate}deg) brightness(${brightness})`
                }}
              />
            </div>
          )
        })}

        {fallenLeaves.map((leaf) => {
          const random = seededRandom(leaf.id * 1000)
          return (
            <div
              key={`fallen-${leaf.id}`}
              className="absolute bottom-0"
              style={{
                left: `${leaf.left}%`,
                transform: `translateY(-${random() * 30}px) rotate(${leaf.rotation}deg) scale(${leaf.size})`,
                zIndex: Math.floor(leaf.left / 10)
              }}
            >
              <img
                src={mapleLeafImages[leaf.imageIndex] || '/placeholder.svg'}
                alt=""
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 opacity-60"
                style={{
                  filter: `hue-rotate(${leaf.hueRotate}deg) brightness(${leaf.brightness})`
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const random = seededRandom(i * 2000 + 54321)
          const left = random() * 100
          const animationDelay = random() * 5
          const animationDuration = 8 + random() * 4
          const lightness = 0.75 + random() * 0.15
          const chroma = 0.08 + random() * 0.04
          const hue = 340 + random() * 40

          return (
            <div
              key={i}
              className="absolute animate-petalFall"
              style={{
                left: `${left}%`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`
              }}
            >
              <div
                className="w-2 h-2 rounded-full opacity-30"
                style={{
                  background: `oklch(${lightness} ${chroma} ${hue})`
                }}
              />
            </div>
          )
        })}
      </div>

      {!isOpen ? (
        <EnvelopeSection onOpen={() => setIsOpen(true)} onEnvelopeClick={handleEnvelopeClick} />
      ) : (
        <div className="space-y-0">
          <CardInvitation />
          {/* <CoupleSection /> */}
          {/* <GallerySection /> */}
        </div>
      )}

      <VinylPlayer ref={vinylPlayerRef} isMiniMode={isOpen} />

      <button
        onClick={() => setShowPromptPayModal(true)}
        className="flex fixed bottom-14 right-14 md:bottom-6 md:right-14 lg:right-20 z-50 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg border-2 border-[#0066CC]/30 hover:border-[#0066CC] transition-all duration-300 items-center justify-center group hover:scale-110"
        aria-label="เปิด PromptPay QR Code"
        title="PromptPay"
      >
        <img src="/icon-pp.png" alt="PromptPay" className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 object-contain" />
      </button>

      <a
        href={MAP_LINK}
        target={MAP_LINK === '#' ? undefined : '_blank'}
        rel={MAP_LINK === '#' ? undefined : 'noopener noreferrer'}
        className="flex fixed bottom-14 right-1 md:bottom-6 md:right-1 z-50 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 items-center justify-center group hover:scale-110"
        aria-label="เปิด Google Maps - ใส่ลิงก์ของคุณ"
        title="เปิด Google Maps (ใส่ลิงก์ของคุณ)"
      >
        <svg
          className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-[#d60808] group-hover:text-[#d60808] transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </a>

      {showPromptPayModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowPromptPayModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPromptPayModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex justify-center mb-4">
              <div className="relative w-full max-w-xs aspect-square rounded-lg shadow-md bg-[#9ca3af]/20 border-2 border-dashed border-[#6b7280]/40 flex items-center justify-center min-h-[200px] overflow-hidden">
                {!promptPayQrLoaded && (
                  <p className="text-[#6b7280] text-sm text-center px-4">
                    ใส่รูป QR Code ของคุณ
                    <br />
                    (public/qrcode.jpg)
                  </p>
                )}
                <img
                  src="/qrcode.jpg"
                  alt="PromptPay QR Code"
                  className={`absolute inset-0 w-full h-full object-contain ${promptPayQrLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setPromptPayQrLoaded(true)}
                  onError={() => setPromptPayQrLoaded(false)}
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg md:text-xl font-medium text-[#8B4513]">{PROMPTPAY_ACCOUNT_NAME}</p>
              <p className="text-xs text-[#8b7355] mt-1"> </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
