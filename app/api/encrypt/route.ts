import { encryptBase64 } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json({ error: 'ต้องส่ง name ใน query parameter' }, { status: 400 })
    }

    const encrypted = encryptBase64(name)

    // สร้าง URL พร้อมใช้
    const origin = request.headers.get('origin') || process.env.SITE_URL || 'http://localhost:3000'
    const invitationUrl = `${origin}/${encrypted}`

    return NextResponse.json({
      success: true,
      encrypted,
      invitationUrl,
      name
    })
  } catch (error) {
    console.error('Encrypt error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการ encrypt' }, { status: 500 })
  }
}
