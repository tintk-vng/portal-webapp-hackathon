import { TELCO_CODE_PREFIX3, TelcoCode } from '@/constants/telco'
import commonUtil from './common'

const telcoUtil = {
  getSupplierLogoByTelcoCode(telcoCode: TelcoCode) {
    if (telcoCode in TelcoCode && telcoCode !== TelcoCode.INVALID) {
      return `https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/${telcoCode.toLowerCase()}.svg`
    }
    return 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/supplier_placeholder.svg'
  },

  formatPhoneNumber(phoneNumber: string): string {
    if (commonUtil.isEmpty(phoneNumber)) {
      return ''
    }
    const whiteSpaceRegex = /\s+/g
    const digitRegex = /\D+/g
    const normalizedPhoneNumber = phoneNumber.replace(whiteSpaceRegex, '').replace(digitRegex, '')
    const dialCode = ['84', '+84', '0084']
    for (let i = 0; i < dialCode.length; i++) {
      if (normalizedPhoneNumber?.indexOf(dialCode[i]) === 0) {
        return normalizedPhoneNumber.replace(dialCode[i], '0').slice(0, 10)
      }
    }
    return normalizedPhoneNumber.slice(0, 10)
  },

  prettyPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
      return ''
    }
    // const { length } = phoneNumber;
    phoneNumber = phoneNumber.replace(/\D+/g, '')
    phoneNumber = `${phoneNumber.substring(0, 4)} ${phoneNumber.substring(
      4,
      7
    )} ${phoneNumber.substring(7)}`
    return phoneNumber
  },

  getTelcoCodeFromPhoneNumber(phoneNumber: string): TelcoCode {
    const prefix3 = phoneNumber.substring(0, 3)
    return TELCO_CODE_PREFIX3[prefix3] || TelcoCode.INVALID
  },

  getTelcoCodeBySupplierID(supplierID: number): TelcoCode {
    switch (supplierID) {
      case 401:
        return TelcoCode.VINAPHONE
      case 402:
        return TelcoCode.MOBIFONE
      case 403:
        return TelcoCode.VIETTEL
      default:
        return TelcoCode.INVALID
    }
  },

  sortSuppliers<T>(suppliers: Array<T & { order?: number }>) {
    const sortedSuppliers = [...suppliers]
    sortedSuppliers.sort((supplierA, supplierB) => supplierA.order! - supplierB.order!)
    return sortedSuppliers
  },
}

export default telcoUtil
