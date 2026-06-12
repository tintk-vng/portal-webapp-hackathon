import Checkbox from '@/components/common/checkbox'
import { IBill, IBillInfo } from '@/types/bill'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { Period } from '.'
import { BillType } from '@/constants/bill'

interface PeriodProps {
  billInfo: IBillInfo
  bill: IBill
  isActive: boolean
  onChange: () => void
  isDisabled: boolean
  onPeriodDetailsView: (period: Period) => void
}

export default function Period({
  billInfo,
  bill,
  isActive = true,
  onChange,
  isDisabled,
  onPeriodDetailsView,
}: PeriodProps) {
  const handlePeriodDetailsView = (e: any) => {
    e.stopPropagation()
    const period = {
      customerCode: billInfo.customerCode,
      supplierID: billInfo.supplierID,
      billID: bill.bill_id,
      month: bill.month_string,
      totalAmount: bill.amount,
    }
    onPeriodDetailsView(period)
  }

  return (
    <div className="h-14 py-4">
      <div
        className={classNames({
          'flex items-center justify-between': true,
          'opacity-50': isDisabled,
        })}
      >
        <Checkbox
          label={bill.month_string ? `Kỳ ${bill.month_string}` : bill.description}
          value={bill.month_string}
          isChecked={isActive}
          onChange={onChange}
        />

        <div
          className="flex cursor-pointer items-center space-x-0.5"
          onClick={handlePeriodDetailsView}
        >
          <label className="cursor-pointer text-label-lg font-bold">
            {commonUtil.formatCurrency(bill.amount)}
          </label>

          {bill.bill_type === BillType.DEBT && bill.month_string && (
            <span className="h-6 w-6 min-w-[24px] cursor-pointer bg-[url('../public/images/icons/primary_next.svg')] bg-contain bg-no-repeat" />
          )}
        </div>
      </div>
    </div>
  )
}
