import { defaultSEOContent } from '@/constants/telco'
import { Metadata } from 'next'
import { ReactNode } from 'react'

const SEOContent = {
  title: 'Mua thẻ cào điện thoại Viettel, Mobi, Vina,... online siêu ưu đãi',
  description:
    'Mua thẻ cào, card điện thoại Viettel, Mobifone, Vinaphone, Gmobile, Vietnamobile online tiện lợi, chiết khấu cao với mệnh giá 10K, 20K, 30K, 50K, 100K, 200K, 500K...',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Mua thẻ điện thoại',
    url: 'https://zalopay.vn/the-dien-thoai',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function PhoneCardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical" href="https://zalopay.vn/the-dien-thoai" />

      {children}
    </>
  )
}
