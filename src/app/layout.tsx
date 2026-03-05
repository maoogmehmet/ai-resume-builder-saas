import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Novatypalcv | The Career Operating System',
    template: '%s | Novatypalcv'
  },
  description: 'The ultimate ATS-optimized resume builder for elite professionals. Reimagining high-performance careers with AI narratives.',
  keywords: ['resume builder', 'CV builder', 'ATS optimization', 'AI resume', 'career growth', 'professional CV'],
  authors: [{ name: 'Novatypalcv Team' }],
  creator: 'Novatypalcv',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://novatypalcv.com',
    siteName: 'Novatypalcv',
    title: 'Novatypalcv | The Career Operating System',
    description: 'The ultimate ATS-optimized resume builder for elite professionals.',
    images: [
      {
        url: 'https://novatypalcv.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Novatypalcv - AI Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Novatypalcv | The Career Operating System',
    description: 'The ultimate ATS-optimized resume builder for elite professionals.',
    images: ['https://novatypalcv.com/og-image.png'],
    creator: '@novatypalcv',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
