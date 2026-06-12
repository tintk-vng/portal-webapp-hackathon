import { API_PATH, AppID, DataPackageGroupType, TelcoCode } from '@/constants/telco'
import axiosClient from '../client'

const COMBO_API_PATH = API_PATH[AppID.COMBO]

const comboAPI = {
  getSuppliers() {
    const url = COMBO_API_PATH.GET_SUPPLIERS
    return axiosClient.get(url)
  },

  getPackages(params: { telcoCode: TelcoCode; type: DataPackageGroupType; phoneNumber: string }) {
    const url = `${COMBO_API_PATH.GET_SUPPLIERS}/${params.telcoCode}/packages?type=${params.type}&phone_number=${params.phoneNumber}`
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
    const url = COMBO_API_PATH.CREATE_ORDER

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

export default comboAPI
