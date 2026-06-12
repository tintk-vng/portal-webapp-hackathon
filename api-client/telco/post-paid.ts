import { API_PATH, AppID } from '@/constants/telco'
import { Captcha } from '@/types/common'
import axiosClient from '../client'

const POST_PAID_API_PATH = API_PATH[AppID.POST_PAID]

const postPaidAPI = {
  getSuppliers() {
    const url = POST_PAID_API_PATH.GET_SUPPLIERS

    return axiosClient.get(url)
  },

  getBillInfo(params: {
    supplierID: number
    customerCode: string
    captcha: Captcha
    captchaCode: string
  }) {
    const url = `${POST_PAID_API_PATH.GET_BILLS}?supplier_id=${params.supplierID}&customer_code=${params.customerCode}`

    return axiosClient.get(url, {
      headers: {
        'Aggregator-Captcha-ID': params.captcha.ID,
        'Aggregator-Captcha-Answer': params.captchaCode,
      },
    })
  },

  createOrder(params: { billInfo: any }) {
    const url = POST_PAID_API_PATH.CREATE_ORDER
    return axiosClient.post(url, JSON.stringify(params.billInfo))
  },
}

export default postPaidAPI
