import { API_PATH, AppID, TelcoCode } from '@/constants/telco'
import axiosClient from '../client'

const DATA_TOPUP_API_PATH = API_PATH[AppID.DATA_TOPUP]

const dataTopupAPI = {
  getSuppliers() {
    const url = DATA_TOPUP_API_PATH.GET_SUPPLIERS

    return axiosClient.get(url)
  },

  createOrder(params: {
    email: string
    voucherCode: string
    packageID: number
    telcoCode: TelcoCode
    phoneNumber: string
    utmSource: string
  }) {
    const url = DATA_TOPUP_API_PATH.CREATE_ORDER

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
            data: {
              package_id: params.packageID,
            },
          },
        },
      })
    )
  },
}

export default dataTopupAPI
