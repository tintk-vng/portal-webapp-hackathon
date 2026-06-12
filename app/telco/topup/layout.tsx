import { defaultSEOContent } from '@/constants/telco'
import { Metadata } from 'next'
import { ReactNode } from 'react'

const SEOContent = {
  title: 'Nạp tiền điện thoại Viettel, Vina, Mobi,... online chiết khấu cao',
  description:
    'Nạp tiền điện thoại MobiFone, VinaPhone, Viettel, Vietnamobile, Gmobile online nhanh chóng, ưu đãi khủng với đa dạng mệnh giá 10K, 20K, 50K, 100K, 200K, 500K',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Nạp điện thoại',
    url: 'https://zalopay.vn/nap-dien-thoai',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function TopupLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical" href="https://zalopay.vn/nap-dien-thoai" />

      {children}
    </>
  )
}
