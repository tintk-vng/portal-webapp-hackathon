import { IBill } from '@/types/bill'
import { EducationBillInfo } from '@/types/bill/education'
import commonUtil from '@/utils/common'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import DebtInfo from '../debt-info'
import Period from './period'
import PeriodDetailsBottomSheet from './period-details-bottom-sheet'

export interface Period {
  customerCode: string
  supplierID: number
  billID: string
  month: string
  totalAmount: number
}

interface PeriodSelectProps {
  billInfo: EducationBillInfo
}

export default function PeriodSelect({ billInfo }: PeriodSelectProps) {
  const [latestBillIndex, setLatestBillIndex] = useState(billInfo.bills.length - 1 || 0)
  const { control, setError, clearErrors } = useFormContext()
  const [selectedPeriod, setSelectedPeriod] = useState<Period>({} as Period)

  const onPeriodSelect = (index: number, cb: (...event: any[]) => void) => {
    let selectedBills: IBill[] = []
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
        selectedBills.push(bill)
      }
    })
    console.log('selectedBills', selectedBills)
    cb(selectedBills)
  }

  const periodDetailsBottomSheetOpen = (period: Period) => {
    setSelectedPeriod(period)
  }

  const periodDetailsBottomSheetClose = () => {
    setSelectedPeriod({} as Period)
  }

  return (
    <div className="mb-4">
      <DebtInfo billInfo={{ ...billInfo, bills: billInfo.bills.slice(0, latestBillIndex + 1) }} />

      <div className="mb-2 text-heading-sm">Kỳ cần thanh toán</div>

      <div className="mb-2 text-label-md text-dark-300">
        Theo quy định, bạn cần chọn từ kỳ cũ nhất trước để thanh toán nhiều hoá đơn cùng lúc
      </div>

      <Controller
        control={control}
        name="bills"
        render={({ field: { onChange, value } }) => (
          <ul>
            {billInfo.bills.map((bill: IBill, index: number, bills: IBill[]) => {
              const isDisabled = index - latestBillIndex > 1

              return (
                <li key={bill.bill_id + index} className="border-b border-dark-50 last:border-b-0">
                  <Period
                    isActive={index <= latestBillIndex}
                    billInfo={billInfo}
                    bill={bill}
                    isDisabled={isDisabled}
                    onChange={() => (isDisabled ? {} : onPeriodSelect(index, onChange))}
                    onPeriodDetailsView={periodDetailsBottomSheetOpen}
                  />
                </li>
              )
            })}
          </ul>
        )}
      />

      <PeriodDetailsBottomSheet
        period={selectedPeriod}
        visible={!commonUtil.isEmpty(selectedPeriod)}
        onClose={periodDetailsBottomSheetClose}
      />
    </div>
  )
}
