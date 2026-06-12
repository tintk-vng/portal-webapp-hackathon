import axiosClient from '../client'

interface BillInfoParams {
  appId: number
  supplierID: number
  customerCode: string
  phoneNumber?: string
}
export const getInternetBillInfoPath = (params: BillInfoParams) => {
  const url = `/api/v1/products/${params.appId}/bills`
  const query = []
  query.push(`supplier_id=${params.supplierID}`)
  query.push(`customer_code=${params.customerCode}`)
  if (params.phoneNumber) {
    query.push(`phone_number=${params.phoneNumber}`)
  }
  return `${url}?${query.join('&')}`
}

const internetAPI = {
  getBillInfo(params: BillInfoParams) {
    const url = getInternetBillInfoPath(params)

    return axiosClient.get(url)
  },

  createOrder(params: { appId: number; billInfo: any }) {
    const url = `/api/v1/products/${params.appId}/orders`

    return axiosClient.post(url, JSON.stringify(params.billInfo))
  },
}

export default internetAPI
