import { ProductID as BillProductID } from '@/constants/bill'
import { TransactionStatus } from '@/constants/common'
import { ProductID as TelcoProductID } from '@/constants/telco'
import { Transaction, TransactionCustomData } from '@/types/common'
import commonUtil from '@/utils/common'
import exp from 'constants'

function mapTransactionStatus(backendTransactionStatus: string): TransactionStatus {
  switch (backendTransactionStatus) {
    case 'SUCCESS':
      return TransactionStatus.SUCCESS
    case 'PROCESSING':
      return TransactionStatus.PROCESSING
    default:
      return TransactionStatus.FAIL
  }
}

function getTransactionCustomData(
  data: { [key: string]: any },
  productID: BillProductID | TelcoProductID
): TransactionCustomData {
  const generalCustomData: TransactionCustomData = {
    status: data.status,
    payment_channel: data.payment_channel,
    status_detail: data.status_detail,
  }
  if (Object.values(BillProductID).includes(productID as BillProductID)) {
    return Object.assign(generalCustomData, getBillCustomData(data))
  }
  if (Object.values(TelcoProductID).includes(productID as TelcoProductID)) {
    return Object.assign(generalCustomData, getTelcoCustomData(data))
  }
  return generalCustomData
}

function getBillCustomData(data: { [key: string]: any }): TransactionCustomData {
  const { customer_code = '', customer_name = '' } = data.order_detail
  return {
    customer_code,
    customer_name,
  }
}

function getTelcoCustomData(data: { [key: string]: any }): TransactionCustomData {
  const {
    supplier_name = '',
    phone_number = '',
    unit_price = 0,
    quantity = 0,
    package_name = '',
  } = data?.order_detail || {}
  return {
    supplier_name,
    phone_number,
    unit_price,
    quantity,
    package_name,
  }
}

const transactionModel = {
  modelTransaction: (data: any, productID: BillProductID | TelcoProductID): Transaction => {
    try {
      if (commonUtil.isEmpty(data)) {
        return {} as Transaction
      }
      const { app_id, app_trans_id, email, status, description, amount, order_detail } = data
      const customData = getTransactionCustomData(data, productID)
      const modeledTransaction: Transaction = {
        appID: app_id,
        appTransID: app_trans_id,
        email,
        amount,
        status: mapTransactionStatus(status),
        customData,
        cards: order_detail?.cards?.map((card: any) => ({
          code: card.card_code,
          serialNo: card.card_serial_no,
          expireTime: card.expire_time,
        })),
      }
      return modeledTransaction
    } catch (error) {
      console.log('Failed to model transaction: ', error)
      return {} as Transaction
    }
  },
}
export default transactionModel
