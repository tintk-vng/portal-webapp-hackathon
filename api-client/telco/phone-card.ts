import { API_PATH, AppID, TelcoCode } from '@/constants/telco'
import axiosClient from '../client'

const PHONE_CARD_API_PATH = API_PATH[AppID.PHONE_CARD]

const phoneCardAPI = {
  getSuppliers() {
    const url = PHONE_CARD_API_PATH.GET_SUPPLIERS

    return axiosClient.get(url)
  },

  createOrder(params: {
    email: string
    voucherCode: string
    amount: number
    telcoCode: TelcoCode
    packageID: number
    quantity: number
    utmSource: string
  }) {
    const url = PHONE_CARD_API_PATH.CREATE_ORDER

    return axiosClient.post(
      url,
      JSON.stringify({
        email: params.email,
        utm_source: params.utmSource,
        promotion_code: params.voucherCode,
        items: {
          telco_items: {
            telco_code: params.telcoCode,
            card: {
              package_id: params.packageID,
              price: params.amount,
              quantity: params.quantity,
            },
          },
        },
      })
    )
  },
}

export default phoneCardAPI
