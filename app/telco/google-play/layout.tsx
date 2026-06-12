import { defaultSEOContent } from '@/constants/telco'
import { Metadata } from 'next'
import { ReactNode } from 'react'

const SEOContent = {
  title: 'Mua mã thẻ Google Play online siêu ưu đãi',
  description:
    'Mua mã thẻ Google Play online tiện lợi, chiết khấu cao với mệnh giá 30K, 50K, 100K, 200K, 300K, 500K, 1000K...',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Mua mã thẻ Google Play',
    url: 'https://zalopay.vn/ma-the-google-play',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function GooglePlayLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical" href="https://zalopay.vn/ma-the-google-play" />

      {children}
    </>
  )
}
