import { defaultSEOContent } from '@/constants/telco'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import Footer from './_components/layout/Footer'
import CustomHeader from './_components/layout/Header'

const SEOContent = {
  title: 'Mua thẻ game - thanh toán qua Zalopay',
  description:
    'nap the game, Zing, Garena, Vcoin, Gate, OnCash, Appota, SohaCoin, Funcard, Scoin, game nap the, nap game',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Mua thẻ game',
    url: 'https://napthevui.vn',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical" href="https://napthevui.vn" />

      <CustomHeader />

      <div className="m-auto md:max-w-6xl md:px-6 md:pb-12 md:pt-6">
        <div className="p-4 md:w-full md:p-0">{children}</div>
      </div>

      <Footer />
    </>
  )
}
