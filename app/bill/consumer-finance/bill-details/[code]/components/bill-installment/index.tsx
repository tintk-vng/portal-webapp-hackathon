'use client'
import RowInfo from '@/app/bill/components/row-info'
import { IBill } from '@/types/bill'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { useMemo } from 'react'
import QuantitySpinner from '../quantity-spinner'
import { useFormContext } from 'react-hook-form'
import DueDate from '../due-date'
interface BillInstallmentProps {
  expiredDate: string
  contractExtInfo: string
  firstBill: IBill
}
const BillInstallment = ({
  expiredDate = '',
  contractExtInfo,
  firstBill,
}: BillInstallmentProps) => {
  const { setValue, watch } = useFormContext()
  const totalAmount = watch('amount', 0)
  const parsedContractExtInfo = useMemo(() => {
    if (!contractExtInfo) {
      return null
    }
    try {
      const result = JSON.parse(contractExtInfo)
      return result
    } catch (error: any) {
      return null
    }
  }, [contractExtInfo])
  const { amount, payment_fee, installment } = firstBill
  const defaultAmount: number = installment?.default || 0
  const numberCurrentNo = Number(parsedContractExtInfo?.currentno)
  const numberTotal = Number(parsedContractExtInfo?.period)
  const numberPaymentPeriods = numberTotal - numberCurrentNo + 1
  const amountPerPeriod = Number(parsedContractExtInfo?.periodicpayment)

  function handleNumberPaymentPeriodsChange(value: number) {
    if (isNaN(amountPerPeriod)) {
      setValue('amount', amount)
      return
    }
    setValue('amount', (value - 1) * amountPerPeriod + amount)
  }

  return (
    <>
      <div className="pb-4 md:pb-0">
        <p className="mb-3 text-base font-bold md:mb-2">Thông tin kỳ thanh toán</p>
        {expiredDate && <DueDate dueDate={expiredDate} />}
        <RowInfo
          titleClassName="text-dark-500"
          boldValue
          title="Số tiền cần thanh toán"
          value={commonUtil.formatCurrency(defaultAmount, true)}
        />
        <RowInfo
          titleClassName="text-dark-500"
          boldValue
          title="Số phí cần thanh toán"
          value={commonUtil.formatCurrency(payment_fee, true)}
        />
        {!isNaN(numberCurrentNo) && (
          <RowInfo
            titleClassName="text-dark-500"
            underline
            boldValue
            title="Kỳ hiện tại thanh toán"
            value={`${numberCurrentNo}/${numberTotal}`}
          />
        )}
        <RowInfo
          titleClassName="text-dark-500"
          boldValue
          title="Tổng tiền thanh toán"
          value={commonUtil.formatCurrency(totalAmount, true)}
        />

        <RowInfo>
          <label className={classNames({ 'w-full text-dark-500': true })}>Số kỳ thanh toán</label>
          <QuantitySpinner
            onChange={handleNumberPaymentPeriodsChange}
            initialValue={1}
            min={1}
            max={isNaN(numberPaymentPeriods) ? 1 : numberPaymentPeriods}
          />
        </RowInfo>
      </div>
    </>
  )
}
export default BillInstallment
