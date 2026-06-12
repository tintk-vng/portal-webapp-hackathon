import aparmentModel from '@/models/bill/apartment'
import { IBill } from '@/types/bill'
import commonUtil from '@/utils/common'

interface BillInfoProps {
  bills: Array<IBill>
}

export default function BillInfo({ bills }: BillInfoProps) {
  const bill = aparmentModel.modelBill(bills)

  if (commonUtil.isEmpty(bill.fees)) {
    return null
  }

  return (
    <div className="mb-4">
      <div className="mb-3 text-heading-sm md:mb-2">Chi tiết hóa đơn</div>

      <ul>
        {bill.fees!.map(
          (fee) =>
            fee.amount > 0 && (
              <li
                key={fee.ID}
                className="flex min-h-[50px] items-center justify-between border-b border-dark-50 py-4 last:border-b-0 md:min-h-[56px]"
              >
                <label className="text-label-lg text-dark-300">{fee.name}</label>

                <label className="max-w-[50%] text-end text-label-lg font-bold">
                  {commonUtil.formatCurrency(fee.amount)}
                </label>
              </li>
            )
        )}
      </ul>
    </div>
  )
}
