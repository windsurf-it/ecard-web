export interface InvitationConfig {
  mapLink: string
  cardFrontImage: string
  cardBackImage: string
  promptPayAccountName: string
  promptPayQrPath: string
}

// อ่านค่าตอน request บน server เท่านั้น - ห้าม import ไฟล์นี้จาก 'use client' component
// เพราะต้องอ่านค่าจาก process.env สดทุกครั้งเพื่อให้ docker-compose environment เปลี่ยนได้โดยไม่ต้อง rebuild image
// (ต่างจาก NEXT_PUBLIC_* ที่ webpack จะ inline ค่าไว้ตอน build)
export function getInvitationConfig(): InvitationConfig {
  return {
    mapLink: process.env.MAP_LINK || '#',
    cardFrontImage: process.env.CARD_FRONT_IMAGE || process.env.CARD_BACK_IMAGE || '/images/card-front.png',
    cardBackImage: process.env.CARD_BACK_IMAGE || '/images/card-back.png',
    promptPayAccountName: process.env.PROMPTPAY_ACCOUNT_NAME || 'ใส่ชื่อบัญชีของคุณ',
    promptPayQrPath: process.env.PROMPTPAY_QR_PATH || ''
  }
}
