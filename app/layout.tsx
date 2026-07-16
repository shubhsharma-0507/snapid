import type { Metadata, Viewport } from 'next'
import { SessionProvider } from 'next-auth/react'
import { RoyalBackground } from '@/components/ui/RoyalBackground'
import './globals.css'

export const metadata: Metadata = {
  title: 'SnapID AI — Royal Passport Photos in Seconds',
  description: 'AI-powered passport photos with instant background removal, face enhancement & compliance for 50+ countries.',
}
export const viewport: Viewport = { themeColor: '#00d4ff' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionProvider>
          <RoyalBackground />
          <div className="relative z-10">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}