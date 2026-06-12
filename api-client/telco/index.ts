import { ProductID, TelcoCode } from '@/constants/telco'
import { SOF } from '@/types/common'
import { DataPackage } from '@/types/telco'
import axiosClient from '../client'

const telcoAPI = {
  getSuppliers(params: { productID: ProductID }) {
    const url = `/api/v1/products/${params.productID}/suppliers`

    return axiosClient.get(url)
  },

  createOrder(params: {
    productID: ProductID
    dataPackage: DataPackage
    quantity: number
    email: string
    voucherCode: string
    utmSource: string
    SOF?: SOF
  }) {
    const { productID, dataPackage, email, SOF, voucherCode, utmSource } = params
    const url = `/api/v1/products/${productID}/orders`

    return axiosClient.post(
      url,
      JSON.stringify({
        items: {
          telco_items: {
            telco_code: dataPackage.telcoCode,
            card: {
              package_id: dataPackage.ID,
              price: dataPackage.amount,
              quantity: params.quantity,
            },
          },
        },
        email,
        sof_id: SOF?.ID,
        promotion_code: voucherCode,
        utm_source: utmSource,
      })
    )
  },
}

export default telcoAPI
