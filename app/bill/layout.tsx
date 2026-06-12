'use client'

import Body from '@/components/layout/body'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import HighlightBanner from '@/components/layout/highlight-banner'
import ServiceBody from '@/components/layout/service-body'
import { AppID } from '@/constants/bill'
import { Domain } from '@/constants/common'
import { Banner, Service } from '@/types/common'
import { supportIframe } from '@/utils/bill'
import { usePathname } from 'next/navigation'

const banners: Banner[] = [
  {
    ID: 1,
    src: 'https://scdn.zalopay.com.vn//zst/zpi/images/bill/web-payment/tkts_banner@3x.png',
    url: 'https://zalo.me/s/3888182390069527250/tai-khoan-tra-sau?utm_source=zalopay_web_bill',
  },
]
const services: Service[] = [
  {
    appID: AppID.ELECTRIC,
    name: 'Điện',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/electric.svg',
    domain: Domain.BILL,
  },
  {
    appID: AppID.WATER,
    name: 'Nước',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/water.svg',
    domain: Domain.BILL,
  },
  {
    appID: AppID.CONSUMER_FINANCE,
    name: 'Thanh toán khoản vay',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/consumer_finance.svg',
    domain: Domain.BILL,
  },
  {
    appID: AppID.EDUCATION,
    name: 'Học phí',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/education.svg',
    domain: Domain.BILL,
  },
  {
    appID: AppID.INTERNET,
    name: 'Internet',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/internet.svg',
    domain: Domain.BILL,
  },
  {
    appID: AppID.TELEVISION,
    name: 'Truyền hình',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/television.svg',
    domain: Domain.BILL,
  },
  {
    appID: AppID.APARTMENT,
    name: 'Phí chung cư',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/apartment.svg',
    domain: Domain.BILL,
  },
]

export default function BillLayout({ children }: { children: React.ReactNode }) {
  const loadIframe = supportIframe(usePathname() || '')
  return (
    <>
      <Header />

      <Body>
        {!loadIframe && <HighlightBanner banners={banners} />}

        <ServiceBody services={services}>{children}</ServiceBody>
      </Body>

      <Footer />
    </>
  )
}
