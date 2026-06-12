import { defaultSEOContent } from '@/constants/telco'
import { Metadata } from 'next'
import { ReactNode } from 'react'

const SEOContent = {
  title: 'Nạp Data 4G/5G online, chiết khấu cao, nhanh chóng, tiện lợi, an toàn',
  description:
    'Nạp Data 4G/5G online tốc độ cao, ưu đãi khủng, nhanh chóng, tiện lợi, an toàn ngay trên website zalopay.vn với gói 1GB, 2GB, 3GB, 7GB,... chỉ từ 5K, 9K, 10K, 15K,...',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Nạp Data 4G/5G',
    url: 'https://zalopay.vn/nap-data',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function DataTopupLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical" href="https://zalopay.vn/nap-data" />

      {children}
    </>
  )
}
