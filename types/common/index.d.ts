import { AppID as BillAppID } from '@/constants/bill'
import { Domain, TransactionStatus, VoucherType } from '@/constants/common'
import { AppID as TelcoAppID } from '@/constants/telco'

declare global {
  interface Window {
    ZPI_TRACKING_SDK: any
  }
}

interface GeneralSection {
  header: string
  contents: { name: string; path?: string; externalPath?: string; logo?: string }[]
  event?: TrackingEvent
}

interface ServicePath {
  source: string
  destination: string
}

interface Service {
  appID: TelcoAppID | BillAppID
  name: string
  logo: any
  domain: Domain
  label?: string
  isExternal?: boolean
  event?: TrackingEvent
}

interface Banner {
  ID: number
  src: string
  url?: string
  title?: string
  description?: string
}

interface Card {
  code: string
  serialNo: string
  expireTime: string
}

interface Transaction {
  appTransID: string
  appID: number
  email: string
  amount: number
  status: TransactionStatus
  customData: TransactionCustomData
  cards?: Card[]
}

interface TransactionCustomData {
  [key: string]: any
}

interface Question {
  ID: number
  title: string
  htmlDescription: string | TrustedHTML
  isCollapsed?: boolean
}

interface Captcha {
  ID: string
  image: string
}

interface Voucher {
  ID: string
  code: string
  type: VoucherType
  value: number
  expiredTime: number
}

interface SOF {
  ID: numer
  name: string
  logoURL: string
  badgeText?: string
}

interface TrackingEvent {
  ID: string
  metaData?: any
}
