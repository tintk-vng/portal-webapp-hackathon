import { API_PATH, AppID, TelcoCode } from '@/constants/telco'
import axiosClient from '../client'

const TOPUP_API_PATH = API_PATH[AppID.TOPUP]

const topupAPI = {
  getSuppliers() {
    const url = TOPUP_API_PATH.GET_SUPPLIERS

    return axiosClient.get(url)
  },

  createOrder(params: {
    email: string
    voucherCode: string
    amount: number
    telcoCode: TelcoCode
    phoneNumber: string
    packageID: number
    quantity: number
    utmSource: string
  }) {
    const url = TOPUP_API_PATH.CREATE_ORDER

    return axiosClient.post(
      url,
      JSON.stringify({
        email: params.email,
        utm_source: params.utmSource,
        promotion_code: params.voucherCode,
        items: {
          telco_items: {
            telco_code: params.telcoCode,
            phone_number: params.phoneNumber,
            top_up: {
              price: params.amount,
              package_id: params.packageID,
              quantity: params.quantity,
            },
          },
        },
      })
    )
  },
}

export default topupAPI
