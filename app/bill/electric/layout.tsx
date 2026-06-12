import { defaultSEOContent } from '@/constants/bill'
import { Metadata } from 'next'
import { ReactNode } from 'react'

const SEOContent = {
  title: 'Tra cứu, thanh toán, trả/đóng hóa đơn tiền điện online an toàn, tiện lợi',
  description:
    'Dịch vụ tra cứu thông tin, thanh toán, nộp, đóng, trả tiền điện online cho bạn và người thân dễ dàng, tiện lợi, mọi lúc mọi nơi, nhanh chóng với nhiều ưu đãi hấp dẫn.',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Thanh toán điện',
    url: 'https://zalopay.vn/dien',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function ElectricLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="canonical dofollow" href="https://zalopay.vn/dien" />

      {children}
    </>
  )
}
