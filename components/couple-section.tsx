'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Navigation } from 'lucide-react'

export function CoupleSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const [countdown, setCountdown] = useState({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const parseEventDate = (dateString: string) => {
      // แปลง "2026-02-26 07:09:00" เป็น Bangkok timezone (UTC+7)
      const isoString = dateString.replace(' ', 'T') + '+07:00'
      return new Date(isoString).getTime()
    }

    const calculateCountdown = () => {
      const eventDate = parseEventDate(process.env.NEXT_PUBLIC_EVENT_DATE || '2026-02-26 07:09:00')
      const now = new Date().getTime()
      const difference = eventDate - now

      if (difference <= 0) {
        setCountdown({
          weeks: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        })
        return
      }

      const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7))
      const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown({
        weeks,
        days,
        hours,
        minutes,
        seconds,
        isExpired: false
      })
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={sectionRef} className="py-8 md:py-12 flex items-center justify-center p-4 md:p-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5F0] via-[#F8F3ED] to-[#FAF5F0] -z-10" />
      <div className="max-w-5xl w-full">
        <div
          className={`text-center space-y-6 md:space-y-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="space-y-1">
            <p className="text-base md:text-lg text-[#5C4033] font-serif">
              {'JOIN US FOR OUR'}
              <br />
              {'HOUSEWARMING CELEBRATION'}
            </p>
          </div>

          <div className="space-y-3 relative">
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-2">
              <div className="h-px w-12 md:w-16 lg:w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#8B4513] opacity-60" />
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#B8860B] to-[#8B4513] opacity-70" />
              <div className="h-px w-12 md:w-16 lg:w-20 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#8B4513] opacity-60" />
            </div>

            <div className="relative inline-block">
              <p
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight font-serif"
                style={{
                  background:
                    'linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #D4AF37 50%, #B8860B 75%, #8B4513 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.05em'
                }}
              >
                26 FEB 26
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 md:gap-4 mt-2">
              <div className="h-px w-12 md:w-16 lg:w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#8B4513] opacity-60" />
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#B8860B] to-[#8B4513] opacity-70" />
              <div className="h-px w-12 md:w-16 lg:w-20 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#8B4513] opacity-60" />
            </div>
          </div>

          {!countdown.isExpired ? (
            <div className="flex items-center justify-center gap-3 md:gap-6 lg:gap-8 pt-4 md:pt-6">
              <div className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B4513] font-serif">
                  {countdown.weeks}
                </p>
                <p className="text-xs md:text-sm text-[#5C4033] uppercase tracking-wider font-serif mt-1">Weeks</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B4513] font-serif">{countdown.days}</p>
                <p className="text-xs md:text-sm text-[#5C4033] uppercase tracking-wider font-serif mt-1">Days</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B4513] font-serif">
                  {countdown.hours}
                </p>
                <p className="text-xs md:text-sm text-[#5C4033] uppercase tracking-wider font-serif mt-1">Hours</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B4513] font-serif">
                  {countdown.minutes}
                </p>
                <p className="text-xs md:text-sm text-[#5C4033] uppercase tracking-wider font-serif mt-1">Min</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B4513] font-serif">
                  {countdown.seconds}
                </p>
                <p className="text-xs md:text-sm text-[#5C4033] uppercase tracking-wider font-serif mt-1">Sec</p>
              </div>
            </div>
          ) : (
            <div className="pt-4 md:pt-6 space-y-4">
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#8B4513] font-serif">
                งานขึ้นบ้านใหม่ของเราเสร็จสิ้นแล้ว
              </p>
              <a
                href="https://maps.app.goo.gl/nDYSaAhNDu6q6pkH7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#d4a574] to-[#b8936a] text-white rounded-full font-medium text-base md:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Navigation className="w-5 h-5 md:w-6 md:h-6" />
                ดูเส้นทางการเดินทาง
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
