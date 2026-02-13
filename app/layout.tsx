import type { Metadata } from 'next'
import { Cormorant_Garamond, Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Our Love Wrapped',
  description: 'A cinematic love story experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} ${playfairDisplay.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  )
}
