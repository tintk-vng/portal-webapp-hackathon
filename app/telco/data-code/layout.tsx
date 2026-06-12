import { defaultSEOContent } from '@/constants/telco'
import { Metadata } from 'next'
import { ReactNode } from 'react'

const SEOContent = {
  title: 'Mua thẻ Data 4G/5G online chiết khấu khủng, siêu ưu đãi',
  description:
    'Mua thẻ cào Data 4G/5G online, chiết khấu cao, an toàn, nhanh chóng ngay trên website zalopay.vn với gói 1 ngày, 10 ngày, 1 tháng chỉ từ 5K, 10K, 14K, 28K,....',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Mua thẻ Data 4G/5G',
    url: 'https://zalopay.vn/the-data',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function DataCodeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical" href="https://zalopay.vn/the-data" />

      {children}
    </>
  )
}
