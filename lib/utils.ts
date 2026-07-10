import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import LZ from 'lz-string'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// สลับตำแหน่งตัวอักษรหลายรอบ (reverse + สลับคู่ + riffle shuffle + rotate) เพื่อให้ยากต่อการอ่านออกด้วยตาเปล่า
// เขียนเป็น index math รอบเดียว (แทนการ split/slice/concat หลายรอบ) แต่ output เหมือนเดิมทุกประการ
// partner() คือ involution ของขั้นตอน reverse+สลับคู่ (partner(partner(j)) === j เสมอ)
function partner(j: number, n: number): number {
  if (j % 2 === 0) return j + 1 < n ? j + 1 : j
  return j - 1
}

// รวมทั้ง 4 ขั้นตอน (reverse, สลับคู่, riffle shuffle, rotate) เป็น loop เดียว ไม่มี array กลาง
// out[q] = str[ srcIndex(q) ] คำนวณตำแหน่งต้นทางตรงๆ ต่อ q หนึ่งค่า
function scramble(str: string): string {
  const n = str.length
  if (n === 0) return ''

  const mid = Math.ceil(n / 2)
  const rotateBy = mid % n
  const out = new Array<string>(n)
  for (let q = 0; q < n; q++) {
    const p = (q + rotateBy) % n
    const srcIdx = p % 2 === 0 ? p / 2 : mid + (p - 1) / 2
    out[q] = str[n - 1 - partner(srcIdx, n)]
  }

  return out.join('')
}

function unscramble(str: string): string {
  const n = str.length
  if (n === 0) return ''

  const mid = Math.ceil(n / 2)
  const rotateBy = mid % n
  const out = new Array<string>(n)
  for (let m = 0; m < n; m++) {
    const k = partner(n - 1 - m, n)
    const p = k < mid ? 2 * k : 2 * (k - mid) + 1
    out[m] = str[(p - rotateBy + n) % n]
  }

  return out.join('')
}

export function encryptBase64(input: string): string {
  try {
    if (!input) return ''

    // 1. Compress ด้วย lz-string
    const compressed = LZ.compressToEncodedURIComponent(input)

    // 2. สับตัวอักษรให้เละหลายรอบ
    const scrambled = scramble(String(compressed))

    return scrambled
  } catch (error) {
    return ''
  }
}

export function decryptBase64(input: string): string {
  try {
    if (!input) return ''

    // 1. กู้ลำดับตัวอักษรกลับ
    const unscrambled = unscramble(String(input))

    // 2. Decompress จาก lz-string
    const decompressed = LZ.decompressFromEncodedURIComponent(unscrambled)

    return decompressed || ''
  } catch (error) {
    console.log('decryptBase64 error: ', error)
    return ''
  }
}

// LZ.decompressFromEncodedURIComponent ไม่ validate input จริงๆ - โค้ดที่ถูกแก้ไข/เดามั่วบางแบบ
// (เช่น เติมตัวเลขนำหน้า) ก็ยัง "decompress" ออกมาเป็น string เพี้ยนๆ (บางครั้งมีอักษรจีนปน) แทนที่จะ error
// เลยต้อง verify ด้วยการ re-encode กลับไปเทียบกับ code เดิม ถ้าไม่ตรงแปลว่า code ถูกแก้ไข/ไม่ใช่ของจริง
export function isValidEncryptedName(code: string): boolean {
  const decoded = decryptBase64(code)
  if (!decoded) return false
  return encryptBase64(decoded) === code
}
