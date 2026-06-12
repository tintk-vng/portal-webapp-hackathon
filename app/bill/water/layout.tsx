import { defaultSEOContent } from '@/constants/bill'
import { Metadata } from 'next'

const SEOContent = {
  title: 'Tra cứu, thanh toán, trả/đóng hóa đơn tiền nước online tiện lợi, nhanh chóng',
  description:
    'Tra cứu, thanh toán hóa đơn tiền nước online cho bạn và thanh toán hộ cho người thân mọi lúc mọi nơi với thao tác đơn giản, an toàn, nhanh chóng, tiện lợi, chiết khấu cao',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Thanh toán nước',
    url: 'https://zalopay.vn/nuoc',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function WaterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="canonical dofollow" href="https://zalopay.vn/nuoc" />

      {children}
    </>
  )
}
