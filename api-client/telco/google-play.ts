import { API_PATH, AppID, TelcoCode } from '@/constants/telco'
import axiosClient from '../client'

const GOOGLE_PLAY_API_PATH = API_PATH[AppID.GOOGLEPLAY]

const googlePlayAPI = {
  getSuppliers() {
    const url = GOOGLE_PLAY_API_PATH.GET_SUPPLIERS

    return axiosClient.get(url)
  },

  // createOrder(params: {
  //   email: string
  //   voucherCode: string
  //   telcoCode: TelcoCode
  //   packageID: number
  //   amount: number
  //   quantity: number
  //   utmSource: string
  // }) {
  //   const url = GOOGLE_PLAY_API_PATH.CREATE_ORDER
  //   return axiosClient.post(
  //     url,
  //     JSON.stringify({
  //       email: params.email,
  //       utm_source: params.utmSource,
  //       promotion_code: params.voucherCode,
  //       items: {
  //         telco_items: {
  //           telco_code: params.telcoCode,
  //           card: {
  //             package_id: params.packageID,
  //             price: params.amount,
  //             quantity: params.quantity,
  //           },
  //         },
  //       },
  //     })
  //   )
  // },
}

export default googlePlayAPI
