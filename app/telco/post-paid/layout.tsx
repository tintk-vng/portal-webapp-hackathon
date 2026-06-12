import { defaultSEOContent } from '@/constants/telco'
import { Metadata } from 'next'
import { ReactNode } from 'react'

const SEOContent = {
  title: 'Tra cứu, thanh toán cước điện thoại trả sau online an toàn, tiện lợi',
  description:
    'Nạp thẻ thuê bao trả sau, thanh toán cước phí điện thoại trả sau Viettel, VinaPhoen, MobiFone online nhanh chóng, an toàn, mọi lúc mọi nơi ngay trên website zalopay.vn',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Điện thoại trả sau',
    url: 'https://zalopay.vn/dien-thoai-tra-sau',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function PostPaidLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical" href="https://zalopay.vn/dien-thoai-tra-sau" />

      {children}
    </>
  )
}
