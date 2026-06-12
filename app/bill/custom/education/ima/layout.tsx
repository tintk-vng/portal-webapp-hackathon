import { AppID, defaultSEOContent } from '@/constants/bill'
import { Metadata } from 'next'
import { ErrorProvider } from '../../../error-context'

const SEOContent = {
  title: 'Tra cứu, thanh toán Học Phí online nhanh chóng, an toàn, tiện lợi',
  description:
    'Thanh toán, đóng học phí online nhanh chóng, an toàn, tiện lợi, mọi lúc mọi nơi ngay trên website zalopay.vn.',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: {
    ...SEOContent,
    ...defaultSEOContent,
    siteName: 'Zalopay - Thanh toán học phí',
    url: 'https://zalopay.vn/hoc-phi',
  },
  twitter: {
    ...SEOContent,
    ...defaultSEOContent,
  },
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider appID={AppID.EDUCATION}>
      <link
        rel="canonical dofollow"
        href="https://zalopay.vn/hoc-phi/uts?supplierid=909&iframe=true"
      />
      {children}
    </ErrorProvider>
  )
}
