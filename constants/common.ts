import { ServicePath } from '@/types/common'
import { AppID as BillAppID } from './bill'
import { AppID as TelcoAppID } from './telco'

export enum Domain {
  COMMON = 'COMMON',
  BILL = 'BILL',
  TELCO = 'TELCO',
}

export enum VoucherType {
  E = 'e',
  V = 'v',
}

export const MAPPED_PATH: Record<Domain, Partial<Record<TelcoAppID | BillAppID, ServicePath>>> = {
  [Domain.COMMON]: {},
  [Domain.BILL]: {
    [BillAppID.ELECTRIC]: {
      source: '/dien',
      destination: '/bill/electric',
    },
    [BillAppID.WATER]: {
      source: '/nuoc',
      destination: '/bill/water',
    },
    [BillAppID.APARTMENT]: {
      source: '/chung-cu',
      destination: '/bill/apartment',
    },
    [BillAppID.CONSUMER_FINANCE]: {
      source: '/vay-tieu-dung',
      destination: '/bill/consumer-finance',
    },
    [BillAppID.INTERNET]: {
      source: '/internet',
      destination: '/bill/internet',
    },
    [BillAppID.TELEVISION]: {
      source: '/truyen-hinh',
      destination: '/bill/television',
    },
    [BillAppID.EDUCATION]: {
      source: '/hoc-phi',
      destination: '/bill/education',
    },
  },
  [Domain.TELCO]: {
    [TelcoAppID.PHONE_CARD]: {
      source: '/the-dien-thoai',
      destination: '/telco/phone-card',
    },
    [TelcoAppID.TOPUP]: {
      source: '/nap-dien-thoai',
      destination: '/telco/topup',
    },
    [TelcoAppID.POST_PAID]: {
      source: '/dien-thoai-tra-sau',
      destination: '/telco/post-paid',
    },
    [TelcoAppID.DATA_TOPUP]: {
      source: '/nap-data',
      destination: '/telco/data-topup',
    },
    [TelcoAppID.DATA_CODE]: {
      source: '/the-data',
      destination: '/telco/data-code',
    },
    [TelcoAppID.COMBO]: {
      source: '/combo-dien-thoai',
      destination: '/telco/combo',
    },
    [TelcoAppID.GOOGLEPLAY]: {
      source: '/ma-the-google-play',
      destination: '/telco/google-play',
    },
    [TelcoAppID.GAME]: {
      source: process.env.NEXT_PUBLIC_GAME_URL || '',
      destination: process.env.NEXT_PUBLIC_GAME_URL || '',
    },
  },
}

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export enum TransactionStatus {
  SUCCESS = 1,
  FAIL,
  PROCESSING,
}

export enum PaymentRule {
  ALL_BILLS = 1,
  EARLIEST_BILL = 2,
  ANY_BILL = 3,
  INPUT_BILL = 5,
  SELECTED_BILLS = 6,
}

export enum DesignSystemIconSize {
  ic24 = 24,
  ic36 = 36,
}

export const EVENT = {
  SIDE_BAR: {
    CLICK_TOPUP: '1403.001',
    CLICK_PHONE_CARD: '1403.002',
    CLICK_POST_PAID: '1403.003',
    CLICK_DATA_TOPUP: '1403.004',
    CLICK_DATA_CODE: '1403.005',
    CLICK_COMBO: '1403.006',
    CLICK_GAME: '1403.007',
    CLICK_GOOGLE_PLAY: '',
  },
  RESULT_PAGE: {
    LOAD_PAGE: '1402.000',
    CLICK_BACK: '1402.001',
    CLICK_SUPPORT: '1402.002',
    CLICK_CUSTOM_BUTTON: '1402.003',
  },
}
