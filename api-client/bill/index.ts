import { API_PATH, AppID } from '@/constants/bill'
import { Captcha } from '@/types/common'
import axiosClient from '../client'

export const getCatalogPath = (params: {
  customerCode: string
  appId: number
  supplierId: number
}) => {
  return `/api/v1/products/${params.appId}/suppliers/${params.supplierId}/catalogs?customer_code=${params.customerCode}`
}
export const getContractsPath = (params: {
  appId: number
  supplierID: number
  identityNumber: string
}) => {
  return `api/v1/products/${params.appId}/suppliers/${params.supplierID}/contracts?identity_number=${params.identityNumber}`
}

const billAPI = {
  getSuppliers(params: { appID: AppID }) {
    const url = API_PATH[params.appID].GET_SUPPLIERS

    return axiosClient.get(url)
  },

  getBillInfo(params: {
    captcha: Captcha
    captchaCode: string
    appID: AppID
    customerCode: string
    supplierID?: number
    departmentCode?: string
    phoneNumber?: string
  }) {
    let url = `${API_PATH[params.appID].GET_BILLS}?customer_code=${params.customerCode}`
    if (params.supplierID) {
      url += `&supplier_id=${params.supplierID}`
    }
    if (params.departmentCode) {
      url += `&department_code=${params.departmentCode}`
    }
    if (params.phoneNumber) {
      url += `&phone_number=${params.phoneNumber}`
    }

    return axiosClient.get(url, {
      headers: {
        'Aggregator-Captcha-ID': params.captcha?.ID,
        'Aggregator-Captcha-Answer': params.captchaCode,
      },
    })
  },

  createOrder(params: { appId: number; order: any; voucherCode?: string; utmSource?: string }) {
    const url = `/api/v1/products/${params.appId}/orders`

    return axiosClient.post(
      url,
      JSON.stringify({
        ...params.order,
        promotion_code: params.voucherCode,
        utm_source: params.utmSource,
      })
    )
  },

  getCatalog(params: { customerCode: string; appId: number; supplierId: number }) {
    const url = `/api/v1/products/${params.appId}/suppliers/${params.supplierId}/catalogs?customer_code=${params.customerCode}`

    return axiosClient.get(url)
  },

  getContracts(params: { appId: number; supplierID: number; identityNumber: string }) {
    const url = getContractsPath(params)

    return axiosClient.get(url)
  },
}

export default billAPI
