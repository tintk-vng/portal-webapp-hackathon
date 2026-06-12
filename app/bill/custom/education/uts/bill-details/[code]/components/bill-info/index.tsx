import { PaymentType } from '@/constants/bill'
import { IBill } from '@/types/bill'
import { EducationBillInfo } from '@/types/bill/education'
import commonUtil from '@/utils/common'

interface BillInfoProps {
  billInfo: EducationBillInfo
}

export default function BillInfo({ billInfo }: BillInfoProps) {
  const { bills, paymentRule } = billInfo

  if (bills.length <= 1) {
    return null
  }

  let visibleBills: Array<IBill>
  if (paymentRule === PaymentType.PayAll) {
    visibleBills = bills
  } else {
    visibleBills = bills.slice(1)
  }

  return (
    <div className="mb-4">
      <ul>
        {visibleBills.map((bill: IBill, index) => {
          return (
            <li
              key={bill.bill_id + index}
              className="flex min-h-[50px] items-center justify-between border-b border-dark-50 py-4 last:border-b-0 md:min-h-[56px]"
            >
              <label className="text-label-lg text-dark-300">{`Tháng ${bill.month_string}`}</label>

              <label className="max-w-[50%] text-end text-label-lg font-bold">
                {commonUtil.formatCurrency(bill.amount)}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
