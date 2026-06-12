import { useEffect, useState } from 'react'
import { IBill, IBillInfo } from '@/types/bill'
import PeriodSelectionItem from '../period-selection-item'
import commonUtil from '@/utils/common'
import { Controller, useFormContext } from 'react-hook-form'
import DebtInfo from '../debt-info'
const PeriodSelections = ({ billInfo }: { billInfo: IBillInfo }) => {
  const [latestBillIndex, setLatestBillIndex] = useState(0)
  const { control, setError, clearErrors } = useFormContext()
  const isDisable = (currentIndex: number, latestIndex: number) => {
    return currentIndex - latestIndex > 1
  }

  useEffect(() => {
    setLatestBillIndex(billInfo.bills.length - 1)
  }, [billInfo.bills])

  const onItemClick = (index: number, clickable: boolean, cb: (...event: any[]) => void) => {
    let _selectedBills: IBill[] = []
    let _totalAmount = 0
    if (clickable) {
      let _index = index
      if (index <= latestBillIndex) {
        _index--
        setLatestBillIndex(index - 1)
      }
      if (_index === -1) {
        setError('period_bills', { message: 'Bạn chưa chọn kỳ thanh toán' })
      } else {
        clearErrors('period_bills')
      }
      setLatestBillIndex(_index)
      billInfo.bills.forEach((bill, index) => {
        if (index <= _index) {
          _selectedBills.push(bill)
          _totalAmount += bill.amount
        }
      })
      cb(_selectedBills)
    }
  }

  return (
    <>
      <Controller
        control={control}
        name="bills"
        render={({ field: { onChange, value } }) => (
          <>
            <DebtInfo
              billInfo={{ ...billInfo, bills: billInfo.bills.slice(0, latestBillIndex + 1) }}
            />
            <label className="text-base font-bold">Kỳ cần thanh toán</label>
            <label className="text-sm text-dark-300">
              Theo quy định, bạn cần chọn từ kỳ cũ nhất trước để thanh toán nhiều hoá đơn cùng lúc
            </label>
            {billInfo.bills.map((bill: IBill, index: number, bills: IBill[]) => {
              return (
                <PeriodSelectionItem
                  active={index <= latestBillIndex}
                  key={bill.bill_id + index}
                  label={`Kỳ ${bill.month_string}`}
                  onChange={() => onItemClick(index, !isDisable(index, latestBillIndex), onChange)}
                  value={commonUtil.formatCurrency(bill.amount)}
                  disble={isDisable(index, latestBillIndex)}
                  underline={index < bills.length - 1}
                />
              )
            })}
          </>
        )}
      />
    </>
  )
}
export default PeriodSelections
