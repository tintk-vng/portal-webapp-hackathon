import { PaymentRule } from '@/constants/common'
import { AppID, SUPPLIER_ORDER_BY_TELCO_CODE } from '@/constants/telco'
import { BillInfo, PostPaidSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'

const parsePaymentRange = (paymentRange: string) => {
  const defaultParsedPaymentRange = {
    minAmount: 1000,
    maxAmount: 10000000,
  }
  if (!paymentRange) {
    return defaultParsedPaymentRange
  }
  try {
    const splittedRanges = paymentRange?.split('-')
    const parsedPaymentRange = {
      minAmount: Number(splittedRanges[0]) || defaultParsedPaymentRange.minAmount,
      maxAmount: Number(splittedRanges[1]) || defaultParsedPaymentRange.maxAmount,
    }
    return parsedPaymentRange
  } catch (error) {
    console.log('Failed to parse payment range: ', error)
    return defaultParsedPaymentRange
  }
}

const postPaidModel = {
  modelSuppliers: (data: any): PostPaidSupplier[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { suppliers } = data
      const modeledSuppliers: PostPaidSupplier[] = suppliers.map((supplier: any) => {
        const telcoCode = telcoUtil.getTelcoCodeBySupplierID(supplier.supplier_id)

        return {
          ID: supplier.supplier_id,
          telcoCode,
          status: supplier.status,
          order: SUPPLIER_ORDER_BY_TELCO_CODE[telcoCode],
        }
      })
      const sortedSuppliers = telcoUtil.sortSuppliers(modeledSuppliers)
      return sortedSuppliers
    } catch (error) {
      console.log('Failed to model suppliers: ', error)
      return []
    }
  },

  modelBillInfo: (data: any): BillInfo => {
    const billInfo = {
      appID: AppID.POST_PAID,
      bills: [],
      customerCode: '',
      paymentRule: 1,
      providerCode: '',
      supplierID: 0,
      totalAmount: 0,
      rawInfo: {},
    }
    try {
      if (commonUtil.isEmpty(data)) {
        return billInfo
      }
      let { bills } = data
      const paymentRule = data.payment_rule
      if (paymentRule !== PaymentRule.ALL_BILLS) {
        bills = [data.bills[0]]
      }
      return {
        appID: data.app_id,
        bills: bills.map((bill: any) => ({
          ID: bill.bill_id,
          type: bill.bill_type,
          customerCode: bill.customer_code,
          amount: bill.amount,
          month: bill.month_string,
          ...parsePaymentRange(bill.payment_range),
        })),
        customerCode: data.customer_code,
        paymentRule,
        providerCode: data.provider_code,
        supplierID: data.supplier_id,
        totalAmount: data.total_amount,
        rawInfo: {
          items: {
            bill_items: {
              ...data,
              bills,
            },
          },
        },
      }
    } catch (error) {
      console.log('Failed to model bill info: ', error)
      return billInfo
    }
  },
}

export default postPaidModel
