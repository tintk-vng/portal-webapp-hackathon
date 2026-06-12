import { defaultSEOContent } from '@/constants/bill'
import { Metadata } from 'next'
import { ReactNode } from 'react'

const SEOContent = {
  title: 'Tra cứu, thanh toán Phí Chung Cư online nhanh chóng, an toàn, tiện lợi',
  description:
    'Thanh toán hóa đơn phí chung cư online nhanh chóng, tiện lợi, tiết kiệm thời gian, bảo mật an toàn, mọi lúc mọi nơi ngay tại website Zalopay.',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Thanh toán phí chung cư',
    url: 'https://zalopay.vn/chung-cu',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function ApartmentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical dofollow" href="https://zalopay.vn/chung-cu" />

      {children}
    </>
  )
}
