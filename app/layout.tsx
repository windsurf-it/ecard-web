import type React from 'react'
import type { Metadata } from 'next'
import { Playfair_Display, Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_EVENT_TITLE}`,
  description: `${process.env.NEXT_PUBLIC_EVENT_TITLE}`,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png'
  },
  openGraph: {
    title: `${process.env.NEXT_PUBLIC_EVENT_TITLE}`,
    description: `${process.env.NEXT_PUBLIC_EVENT_TITLE}`,
    images: [
      {
        url:
          process.env.NEXT_PUBLIC_CARD_FRONT_IMAGE ||
          process.env.NEXT_PUBLIC_CARD_BACK_IMAGE ||
          '/images/card-front.png',
        width: 1200,
        height: 630,
        alt: 'Invitation'
      }
    ],
    type: 'website',
    locale: 'th_TH'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invitation',
    description: '',
    images: [
      process.env.NEXT_PUBLIC_CARD_FRONT_IMAGE || process.env.NEXT_PUBLIC_CARD_BACK_IMAGE || '/images/card-front.png'
    ]
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${geist.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
