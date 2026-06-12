import { IError } from '@/types/bill'
import commonUtil from '@/utils/common'

const billModel = {
  modelSuppliers: (data: any) => {
    try {
      if (commonUtil.isEmpty(data?.suppliers)) {
        return []
      }
      return data.suppliers.map((supplier: any) => ({
        ID: supplier.supplier_id,
        name: supplier.name,
        status: supplier.status,
        icon: supplier.icon,
        queryTypes: supplier.query_types?.map((queryType: any) => ({
          supplierID: queryType.supplier_id,
          name: queryType.name,
          type: queryType.type,
          sampleBillUrl: queryType.sample_bill_link,
          args: queryType.args,
        })),
      }))
    } catch (error) {
      console.log('Failed to model suppliers: ', error)
      return []
    }
  },

  modelBillInfo: (data: any) => {
    const billInfo = {
      appID: data?.app_id,
      bills: [],
      customerCode: '',
      address: '',
      customerName: '',
      paymentRule: 1,
      providerCode: '',
      supplierID: 0,
      totalAmount: 0,
      identityNumber: '',
    }
    try {
      if (commonUtil.isEmpty(data)) {
        return billInfo
      }
      return {
        appID: data.app_id,
        bills: data.bills,
        customerCode: data.customer_code,
        address: data.customer_address,
        customerName: data.customer_name,
        paymentRule: data.payment_rule,
        providerCode: data.provider_code,
        supplierID: data.supplier_id,
        totalAmount: data.total_amount,
        identityNumber: data.customer_identity_number,
      }
    } catch (error) {
      console.log('Failed to model bill info: ', error)
      return billInfo
    }
  },

  modelError: (error: any): IError => {
    try {
      if (commonUtil.isEmpty(error)) {
        return {}
      }
      return {
        code: error.code,
        message: error.message,
        description: error.detail?.description || '',
        domain: error.detail?.domain || '',
        reason: error.detail?.reason || '',
      }
    } catch (error) {
      console.log('Failed to model error: ', error)
      return {}
    }
  },
}

export default billModel
