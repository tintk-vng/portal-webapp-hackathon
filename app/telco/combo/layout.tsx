import { defaultSEOContent } from '@/constants/telco'
import { Metadata } from 'next'
import { ReactNode } from 'react'

const SEOContent = {
  title: 'Nạp Combo Data Nghe Gọi online chiết khấu cao, nhanh chóng, an toàn',
  description:
    'Nạp Combo Data Nghe Gọi online, chiết khấu cao, nhanh chóng, tiện lợi, an toàn ngay tại website Zalopay với gói 1 ngày, 7 ngày, 30 ngày, giá chỉ từ 3K, 10K, 30K, 70K.',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Combo điện thoại',
    url: 'https://zalopay.vn/combo-dien-thoai',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function ComboLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical" href="https://zalopay.vn/combo-dien-thoai" />

      {children}
    </>
  )
}
