'use client'
import { PaymentType } from '@/constants/bill'
import { IBill } from '@/types/bill'
import commonUtil from '@/utils/common'
import RowInfo from '@/app/bill/components/row-info'

interface IBillDescription {
  bills?: Array<IBill>
  className?: string
  paymentRule?: number
}
const BillDescription = ({
  bills = [],
  className = '',
  paymentRule = PaymentType.PayAll,
}: IBillDescription) => {
  if (bills.length <= 1) {
    return null
  }
  let showingBills: Array<IBill>
  if (paymentRule === PaymentType.PayAll) {
    showingBills = bills
  } else {
    showingBills = bills.slice(1)
  }
  return (
    <>
      <div className={className}>
        {paymentRule === PaymentType.PayAll && (
          <>
            <p className="mb-3 text-base font-bold md:mb-2">Chi tiết hoá đơn</p>
          </>
        )}
        {paymentRule === PaymentType.PayByPeriod && (
          <>
            <p className="mb-3 text-base font-bold md:mb-2">Các kỳ còn nợ</p>
            <p className="mb-1 text-label-md md:mb-2 md:text-base">
              Thanh toán các kỳ nợ sau khi hoàn tất thanh toán kỳ cũ nhất
            </p>
          </>
        )}
        <div className="divide-y divide-dark-50 text-label-md md:text-label-lg">
          {showingBills.map((bill: IBill) => {
            return (
              <RowInfo key={bill.bill_id}>
                <label className="w-full text-dark-300">{`Tháng ${bill.month_string}`}</label>
                <label className="w-full text-right font-bold">
                  {commonUtil.formatCurrency(bill.amount)}
                </label>
              </RowInfo>
            )
          })}
        </div>
      </div>
    </>
  )
}
export default BillDescription
