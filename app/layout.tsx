import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR, Noto_Serif_KR, JetBrains_Mono } from 'next/font/google'
import { SiteFooter, SiteHeader } from '@/components/site-header'
import { SITE_BASE_PATH } from '@/lib/site'
import './globals.css'

const sans = Noto_Sans_KR({ subsets: ['latin'], variable: '--font-sans-kr', display: 'swap' })
const serif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif-kr',
  display: 'swap',
})
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-code', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'My Markdown Blog',
    template: '%s | My Markdown Blog',
  },
  description: 'Markdown 파일로 작성하고 관리하는 블로그',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: `${SITE_BASE_PATH}/icon-light-32x32.png`, media: '(prefers-color-scheme: light)' },
      { url: `${SITE_BASE_PATH}/icon-dark-32x32.png`, media: '(prefers-color-scheme: dark)' },
      { url: `${SITE_BASE_PATH}/icon.svg`, type: 'image/svg+xml' },
    ],
    apple: `${SITE_BASE_PATH}/apple-icon.png`,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#faf8f4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${sans.variable} ${serif.variable} ${mono.variable} light`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && process.env.VERCEL && <Analytics />}
      </body>
    </html>
  )
}
