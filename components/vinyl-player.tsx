'use client'

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'

export interface VinylPlayerRef {
  play: () => Promise<void>
  pause: () => void
  togglePlay: () => void
  toggleMute: () => void
  isPlaying: boolean
  isMuted: boolean
}

interface VinylPlayerProps {
  onPlayStateChange?: (isPlaying: boolean) => void
  isMiniMode?: boolean
}

export const VinylPlayer = forwardRef<VinylPlayerRef, VinylPlayerProps>(
  ({ onPlayStateChange, isMiniMode = false }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const wasPlayingBeforeHidden = useRef(false)
    const isPlayingRef = useRef(false)

    const play = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.3
          await audioRef.current.play()
          isPlayingRef.current = true
          setIsPlaying(true)
          onPlayStateChange?.(true)
        } catch (error) {
          console.log('Play failed:', error)
        }
      }
    }

    const pause = () => {
      if (audioRef.current) {
        audioRef.current.pause()
        isPlayingRef.current = false
        setIsPlaying(false)
        onPlayStateChange?.(false)
      }
    }

    const togglePlay = () => {
      if (isPlaying) {
        pause()
      } else {
        play()
      }
    }

    const toggleMute = () => {
      if (audioRef.current) {
        audioRef.current.muted = !isMuted
        setIsMuted(!isMuted)
      }
    }

    useImperativeHandle(ref, () => ({
      play,
      pause,
      togglePlay,
      toggleMute,
      isPlaying,
      isMuted
    }))

    useEffect(() => {
      onPlayStateChange?.(isPlaying)
    }, [isPlaying, onPlayStateChange])

    useEffect(() => {
      const handleVisibilityChange = async () => {
        if (document.visibilityState === 'hidden') {
          wasPlayingBeforeHidden.current = isPlayingRef.current
          if (isPlayingRef.current && audioRef.current) {
            audioRef.current.pause()
            isPlayingRef.current = false
            setIsPlaying(false)
            onPlayStateChange?.(false)
          }
        } else if (document.visibilityState === 'visible') {
          if (wasPlayingBeforeHidden.current && audioRef.current) {
            try {
              audioRef.current.volume = 0.3
              await audioRef.current.play()
              isPlayingRef.current = true
              setIsPlaying(true)
              onPlayStateChange?.(true)
            } catch (error) {
              console.log('Resume failed:', error)
            }
          }
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }, [onPlayStateChange])

    return (
      <>
        <audio
          ref={audioRef}
          loop
          preload="auto"
          onPlay={() => {
            isPlayingRef.current = true
            setIsPlaying(true)
          }}
          onPause={() => {
            isPlayingRef.current = false
            setIsPlaying(false)
          }}
        >
          <source src="/music/card-music.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {isMiniMode ? (
          <>
            <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-auto bg-gradient-to-b from-[#FFF0F5]/95 via-[#F5FDF9]/95 to-[#FFF8F0]/95 backdrop-blur-md border-t border-[#FFB6C1]/30 shadow-lg md:hidden">
              <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="relative w-8 h-8 flex-shrink-0 cursor-pointer" onClick={togglePlay}>
                    <div className="relative w-full h-full rounded-full bg-gradient-radial from-[#FFE5F1] via-[#FFF0F8] to-[#FFE5F1] shadow-md border border-[#FFB6C1]/40 hover:shadow-lg transition-shadow">
                      <div
                        className={`absolute inset-0.5 rounded-full bg-gradient-radial from-[#FFF8F0] via-[#FFE5F1] to-[#FFF0F8] transition-transform duration-300 pointer-events-none ${
                          isPlaying ? 'animate-spin' : ''
                        }`}
                        style={{
                          animationDuration: '3s',
                          animationTimingFunction: 'linear'
                        }}
                      >
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute inset-0 rounded-full border border-[#FFB6C1]/20 pointer-events-none"
                            style={{
                              width: `${100 - i * 15}%`,
                              height: `${100 - i * 15}%`,
                              left: `${i * 7.5}%`,
                              top: `${i * 7.5}%`
                            }}
                          />
                        ))}
                        <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#FFD700] to-[#B8860B] border border-[#C9A961] flex items-center justify-center pointer-events-none">
                          <div className="w-1 h-1 rounded-full bg-[#FFF8F0]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#8B4513] truncate">Home Music</p>
                    <p className="text-[10px] text-[#5C4033]/70 truncate">Music</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#FF91A4] hover:from-[#FF91A4] hover:to-[#FF7A8F] transition-all flex items-center justify-center text-white shadow-md hover:shadow-lg"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden md:block fixed bottom-6 left-6 z-20 pointer-events-auto">
              <div className="relative flex flex-col items-center">
                <div
                  className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#2C2C2C] via-[#1A1A1A] to-[#0A0A0A] shadow-2xl border-4 border-[#3A3A3A] cursor-pointer hover:shadow-2xl transition-shadow"
                  onClick={togglePlay}
                >
                  <div className="absolute inset-2 rounded-full border-2 border-[#4A4A4A] shadow-inner pointer-events-none" />

                  <div
                    className={`absolute inset-4 rounded-full bg-gradient-radial from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] shadow-inner transition-transform duration-300 pointer-events-none ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{
                      animationDuration: '3s',
                      animationTimingFunction: 'linear'
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 rounded-full border border-[#0A0A0A]/30 pointer-events-none"
                        style={{
                          width: `${100 - i * 8}%`,
                          height: `${100 - i * 8}%`,
                          left: `${i * 4}%`,
                          top: `${i * 4}%`
                        }}
                      />
                    ))}

                    <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#654321] shadow-lg border-2 border-[#5C4033] flex items-center justify-center pointer-events-none">
                      <div className="w-2 h-2 rounded-full bg-[#1A1A1A] shadow-inner" />
                    </div>

                    <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#8B4513]/40 blur-sm pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-[#A0522D]/40 blur-sm pointer-events-none" />
                  </div>

                  <div
                    className={`absolute top-0 left-1/2 transform -translate-x-1/2 origin-top transition-transform duration-500 pointer-events-none ${
                      isPlaying ? 'rotate-12' : 'rotate-6'
                    }`}
                    style={{ height: '60%' }}
                  >
                    <div className="relative w-1 h-full bg-gradient-to-b from-[#4A4A4A] via-[#3A3A3A] to-[#2A2A2A] shadow-lg">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-[#5A5A5A] to-[#2A2A2A] border-2 border-[#1A1A1A] shadow-inner" />

                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-[#3A3A3A] to-[#1A1A1A] rounded-sm shadow-md" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePlay()
                      }}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4A4A4A] to-[#2A2A2A] border border-[#5A5A5A] shadow-md hover:shadow-lg transition-all flex items-center justify-center text-white text-xs"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 -z-10 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#8B4513]/20 via-[#A0522D]/10 to-transparent blur-2xl opacity-50" />
              </div>
            </div>
          </>
        ) : (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
            <div className="relative flex flex-col items-center">
              <div
                className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-[#2C2C2C] via-[#1A1A1A] to-[#0A0A0A] shadow-2xl border-4 border-[#3A3A3A] cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={togglePlay}
              >
                <div className="absolute inset-2 rounded-full border-2 border-[#4A4A4A] shadow-inner pointer-events-none" />

                <div
                  className={`absolute inset-4 rounded-full bg-gradient-radial from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] shadow-inner transition-transform duration-300 pointer-events-none ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{
                    animationDuration: '3s',
                    animationTimingFunction: 'linear'
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 rounded-full border border-[#0A0A0A]/30 pointer-events-none"
                      style={{
                        width: `${100 - i * 8}%`,
                        height: `${100 - i * 8}%`,
                        left: `${i * 4}%`,
                        top: `${i * 4}%`
                      }}
                    />
                  ))}

                  <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#654321] shadow-lg border-2 border-[#5C4033] flex items-center justify-center pointer-events-none">
                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#1A1A1A] shadow-inner" />
                  </div>

                  <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#8B4513]/40 blur-sm pointer-events-none" />
                  <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-[#A0522D]/40 blur-sm pointer-events-none" />
                </div>

                <div
                  className={`absolute top-0 left-1/2 transform -translate-x-1/2 origin-top transition-transform duration-500 pointer-events-none ${
                    isPlaying ? 'rotate-12' : 'rotate-6'
                  }`}
                  style={{ height: '60%' }}
                >
                  <div className="relative w-1 h-full bg-gradient-to-b from-[#4A4A4A] via-[#3A3A3A] to-[#2A2A2A] shadow-lg">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-[#5A5A5A] to-[#2A2A2A] border-2 border-[#1A1A1A] shadow-inner" />

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-[#3A3A3A] to-[#1A1A1A] rounded-sm shadow-md" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlay()
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#4A4A4A] to-[#2A2A2A] border border-[#5A5A5A] shadow-md hover:shadow-lg transition-all flex items-center justify-center text-white text-xs"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 -z-10 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-[#8B4513]/20 via-[#A0522D]/10 to-transparent blur-2xl opacity-50" />
            </div>
          </div>
        )}
      </>
    )
  }
)

VinylPlayer.displayName = 'VinylPlayer'
