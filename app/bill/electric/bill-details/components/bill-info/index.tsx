import { BillType } from '@/constants/bill'
import { IBill } from '@/types/bill'
import commonUtil from '@/utils/common'

interface BillInfoProps {
  bills: Array<IBill>
}

export default function BillInfo({ bills }: BillInfoProps) {
  if (bills.length <= 1) {
    return null
  }

  return (
    <div className="mb-4">
      <div className="mb-3 text-heading-sm md:mb-2">Các kỳ còn nợ</div>

      <div className="mb-2 text-label-md md:mb-3 md:text-paragraph-lg">
        Thanh toán các kỳ nợ sau khi hoàn tất thanh toán kỳ cũ nhất
      </div>

      <ul>
        {bills.map((bill, index) => {
          if (index === 0) {
            return null
          }

          return (
            <li
              key={index}
              className="flex min-h-[50px] items-center justify-between border-b border-dark-50 py-4 last:border-b-0 md:min-h-[56px]"
            >
              <label className="text-label-lg text-dark-300">
                {bill.bill_type === BillType.DEBT ? `Tháng ${bill.month_string}` : bill.description}
              </label>

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
