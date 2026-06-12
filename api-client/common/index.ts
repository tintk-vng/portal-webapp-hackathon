import { Voucher } from '@/types/common'
import axiosClient from '../client'

const commonAPI = {
  getTransactionByTransactionID(params: {
    productID: number | string
    appID: number | string
    transactionID: number | string
    amount: string
    discountAmount: string
    checksum: string
    bankCode: string
    pmcID: string
    status: string
  }) {
    const url = `/api/v1/products/${params.productID}/orders/${params.appID}/${params.transactionID}?amount=${params.amount}&discount_amount=${params.discountAmount}&checksum=${params.checksum}&bank_code=${params.bankCode}&pmc_id=${params.pmcID}&status=${params.status}`

    return axiosClient.get(url)
  },

  generateCaptcha(params: { productID: number | string }) {
    const url = `/api/v1/products/${params.productID}/captcha`

    return axiosClient.get(url)
  },

  getVoucher(params: { productID: number | string; encrypt: string }) {
    const url = `/api/v1/products/${params.productID}/vouchers?encrypt=${params.encrypt}`

    return axiosClient.get(url)
  },

  splitVoucher(params: {
    productID: number | string
    voucherToken: string
    voucher: Voucher
    splitValue: string
  }) {
    const url = `/api/v1/products/${params.productID}/vouchers:split`

    return axiosClient.post(
      url,
      JSON.stringify({
        voucher_token: params.voucherToken,
        voucher_id: params.voucher.ID,
        value: Number(params.splitValue),
        expired_time: params.voucher.expiredTime,
      })
    )
  },

  getSOFs(params: { productLineID: number | string }) {
    const url = `/api/v1/products/${params.productLineID}/sofs`

    return axiosClient.get(url)
  },
}

export default commonAPI
