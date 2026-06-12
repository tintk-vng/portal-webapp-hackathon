import HighlightBanner from '@/components/layout/highlight-banner'
import ServiceBody from '@/components/layout/service-body'
import { Domain, EVENT } from '@/constants/common'
import { AppID } from '@/constants/telco'
import { Banner, Service } from '@/types/common'
import { ReactNode } from 'react'
import Body from '@/components/layout/body'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'

const banners: Banner[] = [
  {
    ID: 1,
    src: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/banners/banner_9.jpg',
    url: 'https://km.zalopay.vn/TSui/napdt25K',
  },
  {
    ID: 2,
    src: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/banners/banner_7.jpg',
    url: 'https://zalo.me/s/3888182390069527250/tai-khoan-tra-sau?utm_source=zalopay_web_telco',
  },
  {
    ID: 3,
    src: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/banners/banner_8.jpg',
  },
]

const services: Service[] = [
  {
    appID: AppID.TOPUP,
    name: 'Nạp tiền ĐT',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/topup.svg',
    domain: Domain.TELCO,
    event: { ID: EVENT.SIDE_BAR.CLICK_TOPUP },
  },
  {
    appID: AppID.PHONE_CARD,
    name: 'Mua thẻ ĐT',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/phone_card.svg',
    domain: Domain.TELCO,
    event: { ID: EVENT.SIDE_BAR.CLICK_PHONE_CARD },
  },
  {
    appID: AppID.POST_PAID,
    name: 'ĐT trả sau',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/post_paid.svg',
    domain: Domain.TELCO,
    event: { ID: EVENT.SIDE_BAR.CLICK_POST_PAID },
  },
  {
    appID: AppID.DATA_TOPUP,
    name: 'Nạp Data 4G/5G',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/data_topup.svg',
    domain: Domain.TELCO,
    event: { ID: EVENT.SIDE_BAR.CLICK_DATA_TOPUP },
  },
  {
    appID: AppID.DATA_CODE,
    name: 'Mua thẻ Data 4G/5G',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/data_code.svg',
    domain: Domain.TELCO,
    event: { ID: EVENT.SIDE_BAR.CLICK_DATA_CODE },
  },
  {
    appID: AppID.COMBO,
    name: 'Combo',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/combo.svg',
    domain: Domain.TELCO,
    event: { ID: EVENT.SIDE_BAR.CLICK_COMBO },
  },
  {
    appID: AppID.GOOGLEPLAY,
    name: 'Mã thẻ Google Play',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/google_play.svg',
    domain: Domain.TELCO,
    event: { ID: EVENT.SIDE_BAR.CLICK_GOOGLE_PLAY },
  },
  {
    appID: AppID.GAME,
    name: 'Mua thẻ game',
    label: 'Mới',
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/game.svg',
    domain: Domain.TELCO,
    event: { ID: EVENT.SIDE_BAR.CLICK_GAME },
  },
]

export default function TelcoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />

      <Body>
        <HighlightBanner banners={banners} />

        <ServiceBody services={services}>{children}</ServiceBody>
      </Body>

      <Footer />
    </>
  )
}
