import { AppID, defaultSEOContent } from '@/constants/bill'
import { Metadata } from 'next'
import { ErrorProvider } from '../error-context'

const SEOContent = {
  title: 'Tra cứu, thanh toán tiền mạng Internet nhanh chóng, an toàn, tiện lợi',
  description:
    'Tra cứu, thanh toán tiền mạng Internet: VNPT, Viettel Telecom, HTVC, FPT Telecom, Viễn thông ACT,... nhanh chóng, an toàn, tiện lợi ngay trên website zalopay.vn.',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Thanh toán mạng internet',
    url: 'https://zalopay.vn/internet',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function InternetLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider appID={AppID.INTERNET}>
      <link rel="canonical dofollow" href="https://zalopay.vn/internet" />

      {children}
    </ErrorProvider>
  )
}
