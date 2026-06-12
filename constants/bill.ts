export enum AppID {
  ELECTRIC = 17,
  WATER = 18,
  TELEVISION = 21,
  INTERNET = 20,
  CONSUMER_FINANCE = 797,
  APARTMENT = 833,
  EDUCATION = 1111,
  TOLL = 599,
}

export enum ProductID {
  ELECTRIC = 17,
  WATER = 18,
  TELEVISION = 21,
  INTERNET = 20,
  CONSUMER_FINANCE = 797,
  APARTMENT = 833,
  EDUCATION = 1111,
  TOLL = 599,
}

export const PaymentType = {
  Outstanding: -1,
  PayAll: 1,
  PayByPeriod: 2,
  PrePaid: 3,
  PostPaid: 5,
  PayBySelectedPeriod: 6,
}

export const ReturnCode = {
  Outstanding: -700,
  Success: 1,
  Erorr: 0,
  Timeout: 500,
}

export const SupplierId = {
  K_Plus: 304,
  Quang_Ich: 906,
}

export enum PackageType {
  PackageSCTV = 0,
  PackageKPlus = 1,
  PackageViettel = 2,
  DurationKPlus = 3,
}

export enum BillType {
  DEBT = 1,
  FEE = 20,
}

export enum QueryBillTypes {
  IDENTITY = 3,
}

export const defaultSEOContent = {
  images: ['https://scdn.zalopay.com.vn/zst/zpi/images/telco/banners_v2/bill_thumbnail.jpg'],
  type: 'website',
}

export const API_PATH: Record<AppID, { [key: string]: string }> = {
  [AppID.ELECTRIC]: {
    GET_BILLS: `/api/v1/products/${ProductID.ELECTRIC}/bills`,
  },
  [AppID.WATER]: {
    GET_BILLS: `/api/v1/products/${ProductID.WATER}/bills`,
    GET_SUPPLIERS: `/api/v1/products/${ProductID.WATER}/suppliers`,
  },
  [AppID.TELEVISION]: {
    GET_BILLS: `/api/v1/products/${ProductID.TELEVISION}/bills`,
    GET_SUPPLIERS: `/api/v1/products/${ProductID.TELEVISION}/suppliers`,
  },
  [AppID.INTERNET]: {
    GET_BILLS: `/api/v1/products/${ProductID.INTERNET}/bills`,
    GET_SUPPLIERS: `/api/v1/products/${ProductID.INTERNET}/suppliers`,
  },
  [AppID.CONSUMER_FINANCE]: {
    GET_BILLS: `/api/v1/products/${ProductID.CONSUMER_FINANCE}/bills`,
    GET_SUPPLIERS: `/api/v1/products/${ProductID.CONSUMER_FINANCE}/suppliers`,
  },
  [AppID.APARTMENT]: {
    GET_BILLS: `/api/v1/products/${ProductID.APARTMENT}/bills`,
    GET_SUPPLIERS: `/api/v1/products/${ProductID.APARTMENT}/suppliers`,
  },
  [AppID.EDUCATION]: {
    GET_BILLS: `/api/v1/products/${ProductID.EDUCATION}/bills`,
    GET_SUPPLIERS: `/api/v1/products/${ProductID.EDUCATION}/suppliers`,
  },
  [AppID.TOLL]: {
    GET_BILLS: `/api/v1/products/${ProductID.TOLL}/bills`,
  },
}

export const EVENT: Record<any, { [key: string]: string }> = {}

export enum SupplierID {
  HOME_CREDIT = 700,
  MIRAE_ASSET = 702,
  FE_CREDIT = 701,
  SHINHAN = 703,
  MC_CREDIT = 704,
  TP_BANK_FICO = 707,
  VIET_CREDIT = 710,
  F88 = 718,
  WelcomeDTC = 722,
  SHBCard = 712,
  QUANG_ICH = 906,
  JET_PAY = 903,
  VN_EDU = 902,
  RT_HOLDINGS = 907,
}

export enum CFContractType {
  Default = 'DEBT_COLLECTION',
  Loan = 'LOAN',
  Card = 'CARD',
  Banca = 'BANCA',
  Installment = 'INSTALLMENT',
}

export const THEME_COLOR = {
  IMA: '#8dc63f',
  UTS: '#FF8302',
}
