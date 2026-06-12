import { AppID, defaultSEOContent } from '@/constants/bill'
import { Metadata } from 'next'
import { ErrorProvider } from '../error-context'

const SEOContent = {
  title: 'Tra cứu, thanh toán cước Truyền Hình online nhanh chóng, an toàn, tiện lợi',
  description:
    'Tra cứu, thanh toán cước truyền hình toàn quốc (VNPT, HTVC, Viettel Telecom, K+, VTVcab,...) online, chiết khấu cao, an toàn, nhanh chóng ngay trên website zalopay.vn',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Thanh toán cước truyền hình',
    url: 'https://zalopay.vn/truyen-hinh',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function TelevisionLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider appID={AppID.TELEVISION}>
      <link rel="canonical" href="https://zalopay.vn/truyen-hinh" />

      {children}
    </ErrorProvider>
  )
}
