"use client"
import { useState, useEffect, useRef, useCallback } from "react"
interface GalleryImage {
  id: string
  folderId: string
  src: string
  thumbnail: string
  title?: string
  description?: string
}
const GRAY_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#9ca3af"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="20" font-family="sans-serif">Photo</text></svg>'
  )
const folderIds = ['1', '2', '3', '7', '5', '4', '8', '9', '10', '11', '12', '13', '14']
const folderImagesMap: Record<string, string[]> = {
  '1': ['main.svg'],
  '2': ['main.svg'],
  '3': ['main.svg'],
  '4': ['main.svg'],
  '5': ['main.svg'],
  '7': ['main.svg'],
  '8': ['main.svg'],
  '9': ['main.svg'],
  '10': ['main.svg'],
  '11': ['main.svg'],
  '12': ['main.svg'],
  '13': ['main.svg'],
  '14': ['main.svg'],
}
const USE_MOCKUP_IMAGES = false
const getThumbnailFile = (folderId: string) => {
  const files = folderImagesMap[folderId] || ['main.svg']
  return files[0] || 'main.svg'
}
const galleryImages: GalleryImage[] = folderIds.map((folderId) => {
  const file = getThumbnailFile(folderId)
  const base = `/slide-images/${folderId}/${file}`
  return {
    id: folderId,
    folderId: folderId,
    src: USE_MOCKUP_IMAGES ? GRAY_PLACEHOLDER : base,
    thumbnail: USE_MOCKUP_IMAGES ? GRAY_PLACEHOLDER : base,
    title: `Album ${folderId}`,
    description: `Beautiful memories from album ${folderId}`,
  }
})
const loadAlbumImages = async (folderId: string): Promise<string[]> => {
  if (USE_MOCKUP_IMAGES) {
    return [GRAY_PLACEHOLDER, GRAY_PLACEHOLDER, GRAY_PLACEHOLDER, GRAY_PLACEHOLDER, GRAY_PLACEHOLDER]
  }
  const imageFiles = folderImagesMap[folderId] || ['main.svg']
  return imageFiles.map((filename) => `/slide-images/${folderId}/${filename}`)
}
export function GallerySection() {
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryImage | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [albumImages, setAlbumImages] = useState<string[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(true)
  const scrollPositionRef = useRef<number>(0) 
  const animationIdRef = useRef<number | null>(null) 
  const isScrollingRef = useRef<boolean>(true) 
  useEffect(() => {
    isScrollingRef.current = isScrolling
  }, [isScrolling])
  useEffect(() => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollSpeed = 1.2 
    const scroll = () => {
      if (!container) return
      if (!isScrollingRef.current) {
        animationIdRef.current = requestAnimationFrame(scroll)
        return
      }
      scrollPositionRef.current = container.scrollLeft
      scrollPositionRef.current += scrollSpeed
      container.scrollLeft = scrollPositionRef.current
      const firstSetWidth = container.scrollWidth / 2
      if (scrollPositionRef.current >= firstSetWidth && firstSetWidth > 0) {
        scrollPositionRef.current = scrollPositionRef.current - firstSetWidth
        container.scrollLeft = scrollPositionRef.current
      }
      animationIdRef.current = requestAnimationFrame(scroll)
    }
    const initTimer = setTimeout(() => {
      if (container && container.scrollWidth > 0) {
        container.scrollLeft = 0
        scrollPositionRef.current = 0
        animationIdRef.current = requestAnimationFrame(scroll)
      }
    }, 200)
    return () => {
      clearTimeout(initTimer)
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }
    }
  }, []) 
  const handleMouseEnter = () => setIsScrolling(false)
  const handleMouseLeave = () => setIsScrolling(true)
  const openAlbum = async (image: GalleryImage) => {
    const index = galleryImages.findIndex(img => img.id === image.id)
    setSelectedImageIndex(0) 
    setSelectedAlbum(image)
    const images = await loadAlbumImages(image.folderId)
    setAlbumImages(images)
  }
  const closeAlbum = useCallback(() => {
    setSelectedAlbum(null)
    setAlbumImages([])
    setSelectedImageIndex(0)
  }, [])
  const nextImage = useCallback(() => {
    if (albumImages.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % albumImages.length)
    }
  }, [albumImages.length])
  const prevImage = useCallback(() => {
    if (albumImages.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + albumImages.length) % albumImages.length)
    }
  }, [albumImages.length])
  useEffect(() => {
    if (!selectedAlbum) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAlbum()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedAlbum, nextImage, prevImage, closeAlbum])
  return (
    <>
      <section className="relative py-16 md:py-24 overflow-x-hidden overflow-y-visible">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#8B4513] mb-4 font-serif" style={{
              fontFamily: 'var(--font-serif)',
            }}>
              Our Gallery
            </h2>
          </div>
          <div className="relative overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5F0] via-[#F8F3ED] to-[#FAF5F0] rounded-lg shadow-lg border border-[#E8D5B7]/30">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(139,69,19,0.02) 2px,
                  rgba(139,69,19,0.02) 4px
                )`,
              }} />
            </div>
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#F5E6D3] via-[#F8F3ED] to-[#FAF5F0] rounded-t-lg z-20 overflow-hidden border-b border-[#E8D5B7]/40">
              <div className="flex items-center justify-start h-full gap-1 px-2" style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 18px,
                  rgba(139,69,19,0.05) 18px,
                  rgba(139,69,19,0.05) 20px
                )`,
              }}>
                {[...Array(100)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 rounded-full bg-[#F5E6D3] border border-[#E8D5B7]/50 shadow-sm"
                    style={{ marginLeft: i === 0 ? '0' : '15px' }}
                  />
                ))}
              </div>
            </div>
            <div
              ref={scrollContainerRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide py-16 px-4 md:px-6 bg-transparent z-10"
              style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'nowrap',
              } as React.CSSProperties}
            >
              {galleryImages.map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="flex-shrink-0 cursor-pointer group"
                  onClick={() => openAlbum(image)}
                >
                  <div className="relative w-52 md:w-72 lg:w-96 h-72 md:h-96 lg:h-[28rem] bg-[#F5E6D3] rounded-sm shadow-lg border border-[#E8D5B7]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#D4AF37]/40">
                    <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-center gap-2 z-10">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className="relative w-3 h-3 mx-auto"
                        >
                          <div className="absolute inset-0 rounded-full bg-[#F5E6D3] border-2 border-[#E8D5B7] shadow-sm" />
                          <div className="absolute inset-1 rounded-full bg-[#FAF5F0] opacity-60" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col justify-center gap-2 z-10">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className="relative w-3 h-3 mx-auto"
                        >
                          <div className="absolute inset-0 rounded-full bg-[#F5E6D3] border-2 border-[#E8D5B7] shadow-sm" />
                          <div className="absolute inset-1 rounded-full bg-[#FAF5F0] opacity-60" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-2 left-6 z-20 text-[#8B4513] text-[8px] md:text-[10px] font-mono opacity-50">
                      {String(index % galleryImages.length + 1).padStart(3, '0')}
                    </div>
                    <div className="absolute top-2 right-6 z-20 text-[#8B4513] text-[8px] md:text-[10px] font-mono opacity-50">
                      {String(index % galleryImages.length + 1).padStart(3, '0')}
                    </div>
                    <div className="relative w-full h-full mx-4 my-2 rounded-sm overflow-hidden bg-gradient-to-br from-[#FAF5F0] to-[#F5E6D3] border border-[#E8D5B7]/60">
                      <div className="absolute inset-0 opacity-[0.02] z-10 pointer-events-none" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      }} />
                      <img
                        src={image.thumbnail || image.src}
                        alt={image.title || "Gallery image"}
                        className="w-full h-full object-cover relative z-0"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100/20 via-amber-100/20 to-transparent">
                                <div class="text-center p-4">
                                  <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                                    <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <p class="text-white text-xs md:text-sm font-serif">${image.title || "Photo"}</p>
                                </div>
                              </div>
                            `
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 z-10 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-20">
                        <div className="text-white text-center px-4">
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-sm pointer-events-none" style={{
                      boxShadow: 'inset 0 0 10px rgba(139,69,19,0.1), inset 0 0 20px rgba(139,69,19,0.05)',
                    }} />
                  </div>
                </div>
              ))}
              {galleryImages.map((image, index) => (
                <div
                  key={`${image.id}-duplicate-${index}`}
                  className="flex-shrink-0 cursor-pointer group"
                  onClick={() => openAlbum(image)}
                >
                  <div className="relative w-52 md:w-72 lg:w-96 h-72 md:h-96 lg:h-[28rem] bg-[#F5E6D3] rounded-sm shadow-lg border border-[#E8D5B7]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#D4AF37]/40">
                    <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-center gap-2 z-10">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className="relative w-3 h-3 mx-auto"
                        >
                          <div className="absolute inset-0 rounded-full bg-[#F5E6D3] border-2 border-[#E8D5B7] shadow-sm" />
                          <div className="absolute inset-1 rounded-full bg-[#FAF5F0] opacity-60" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col justify-center gap-2 z-10">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className="relative w-3 h-3 mx-auto"
                        >
                          <div className="absolute inset-0 rounded-full bg-[#F5E6D3] border-2 border-[#E8D5B7] shadow-sm" />
                          <div className="absolute inset-1 rounded-full bg-[#FAF5F0] opacity-60" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-2 left-6 z-20 text-[#8B4513] text-[8px] md:text-[10px] font-mono opacity-50">
                      {String((index + galleryImages.length) % galleryImages.length + 1).padStart(3, '0')}
                    </div>
                    <div className="absolute top-2 right-6 z-20 text-[#8B4513] text-[8px] md:text-[10px] font-mono opacity-50">
                      {String((index + galleryImages.length) % galleryImages.length + 1).padStart(3, '0')}
                    </div>
                    <div className="relative w-full h-full mx-4 my-2 rounded-sm overflow-hidden bg-gradient-to-br from-[#FAF5F0] to-[#F5E6D3] border border-[#E8D5B7]/60">
                      <div className="absolute inset-0 opacity-[0.02] z-10 pointer-events-none" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      }} />
                      <img
                        src={image.thumbnail || image.src}
                        alt={image.title || "Gallery image"}
                        className="w-full h-full object-cover relative z-0"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100/20 via-amber-100/20 to-transparent">
                                <div class="text-center p-4">
                                  <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                                    <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <p class="text-white text-xs md:text-sm font-serif">${image.title || "Photo"}</p>
                                </div>
                              </div>
                            `
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 z-10 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-20">
                        <div className="text-white text-center px-4">
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-sm pointer-events-none" style={{
                      boxShadow: 'inset 0 0 10px rgba(139,69,19,0.1), inset 0 0 20px rgba(139,69,19,0.05)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#F5E6D3] via-[#F8F3ED] to-[#FAF5F0] rounded-b-lg z-20 overflow-hidden border-t border-[#E8D5B7]/40">
              <div className="flex items-center justify-start h-full gap-1 px-2" style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 18px,
                  rgba(139,69,19,0.05) 18px,
                  rgba(139,69,19,0.05) 20px
                )`,
              }}>
                {[...Array(100)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 rounded-full bg-[#F5E6D3] border border-[#E8D5B7]/50 shadow-sm"
                    style={{ marginLeft: i === 0 ? '0' : '15px' }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#F5E6D3] via-[#F8F3ED] to-[#E8D5B7] border-4 border-[#E8D5B7] shadow-lg z-30">
              <div className="absolute inset-2 rounded-full border-2 border-[#D4C4A8]" />
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#E8D5B7]" />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#F5E6D3] via-[#F8F3ED] to-[#E8D5B7] border-4 border-[#E8D5B7] shadow-lg z-30">
              <div className="absolute inset-2 rounded-full border-2 border-[#D4C4A8]" />
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#E8D5B7]" />
            </div>
          </div>
        </div>
      </section>
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeAlbum}
        >
          <button
            onClick={closeAlbum}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 md:left-8 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 md:right-8 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="Next"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div
            className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center mb-4">
              <div className="relative w-full h-full max-w-5xl">
                <div className="absolute inset-0 border-4 border-white/20 rounded-lg shadow-2xl" />
                <div className="absolute inset-4 border-2 border-white/10 rounded-lg" />
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center">
                  {albumImages.length > 0 && albumImages[selectedImageIndex] ? (
                    <img
                      src={albumImages[selectedImageIndex]}
                      alt={selectedAlbum?.title || "Gallery image"}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        const currentIndex = selectedImageIndex
                        let foundNext = false
                        for (let i = 1; i < albumImages.length; i++) {
                          const nextIndex = (currentIndex + i) % albumImages.length
                          if (nextIndex !== currentIndex) {
                            setSelectedImageIndex(nextIndex)
                            foundNext = true
                            break
                          }
                        }
                        if (!foundNext) {
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100/20 via-amber-100/20 to-transparent">
                                <div class="text-center p-8">
                                  <div class="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                                    <svg class="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <p class="text-white text-lg md:text-xl font-serif font-semibold">
                                    ${selectedAlbum?.title || "Photo"}
                                  </p>
                                </div>
                              </div>
                            `
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center animate-pulse">
                          <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-white text-lg md:text-xl font-serif font-semibold">Loading...</p>
                      </div>
                    </div>
                  )}
                  {albumImages.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-6">
                    </div>
                  )}
                </div>
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
              </div>
            </div>
            {albumImages.length > 0 && (
              <div className="flex gap-2 md:gap-3 overflow-x-auto max-w-5xl px-4 py-2 scrollbar-hide">
                {albumImages.map((imgSrc, index) => (
                  <button
                    key={`${selectedAlbum?.folderId}-${index}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex(index)
                    }}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? "border-[#D4AF37] scale-110 shadow-lg"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center">
                              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                          `
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
            {albumImages.length > 0 && (
              <div className="absolute bottom-4 md:bottom-8 text-white/60 text-sm font-serif">
                {selectedImageIndex + 1} / {albumImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
