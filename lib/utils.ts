import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import LZ from 'lz-string'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encryptBase64(input: string): string {
  try {
    if (!input) return ''

    // 1. Compress ด้วย lz-string
    const compressed = LZ.compressToEncodedURIComponent(input)

    // 2. สลับตัวอักษร (reverse)
    const scrambled = String(compressed).split('').reverse().join('')

    return scrambled
  } catch (error) {
    return ''
  }
}

export function decryptBase64(input: string): string {
  try {
    if (!input) return ''

    // 1. สลับตัวอักษรกลับ
    const unscrambled = String(input).split('').reverse().join('')

    // 2. Decompress จาก lz-string
    const decompressed = LZ.decompressFromEncodedURIComponent(unscrambled)

    return decompressed || ''
  } catch (error) {
    console.log('decryptBase64 error: ', error)
    return ''
  }
}
