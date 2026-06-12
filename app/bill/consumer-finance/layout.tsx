import { AppID, defaultSEOContent } from '@/constants/bill'
import { Metadata } from 'next'
import { ErrorProvider } from '../error-context'

const SEOContent = {
  title:
    'Tra cứu, thanh toán khoản vay tiêu dùng/ Trả Góp trực tuyến an toàn, tiện lợi, nhanh chóng',
  description:
    'Tra cứu, thanh toán khoảng vay trả góp (Home Credit, Shinhan Finance, Mirae Asset Finance,...) online, chiết khấu cao, an toàn, nhanh chóng ngay trên website zalopay.vn',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Thanh toán vay tiêu dùng',
    url: 'https://zalopay.vn/vay-tieu-dung',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function ConsumerFinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider appID={AppID.CONSUMER_FINANCE}>
      <link rel="canonical dofollow" href="https://zalopay.vn/vay-tieu-dung" />

      {children}
    </ErrorProvider>
  )
}
