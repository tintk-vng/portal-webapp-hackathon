'use client'

import { TelcoCode } from '@/constants/telco'
import { BillInfo } from '@/types/telco'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'
import { createContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { BillInfoState } from '../main'
import { StateType } from '../state'
import SkeletonState from '../state/skeleton-state'
import SkeletonBillDetails from './skeleton-bill-details'

const State = dynamic(() => import('../state'), {
  loading: () => <SkeletonState />,
})
const InvoiceInput = dynamic(() => import('../invoice-input'))
const BillDetails = dynamic(() => import('./bill-details'), {
  loading: () => <SkeletonBillDetails />,
})

interface BillInfoContext {
  billInfo: BillInfo
}

export const BillInfoContext = createContext({} as BillInfoContext)

type FormValues = {
  amount: number | undefined
  email: string
  voucherCode: string
}

interface BillInfoProps {
  billInfoState: BillInfoState
  telcoCode: TelcoCode
  onOtherPhoneNumberPay: () => void
}

export default function BillInfo({
  billInfoState,
  telcoCode,
  onOtherPhoneNumberPay,
}: BillInfoProps) {
  const methods = useForm<FormValues>({
    defaultValues: {
      amount: undefined,
      email: '',
      voucherCode: '',
    } as FormValues,
  })
  const { billInfo, error, isLoading } = billInfoState

  if (error) {
    return <State type={StateType.MAINTENANCE} extraInfo={{ telcoCode }} />
  }

  if (isLoading || !billInfo) {
    return (
      <div className="md:pt-6">
        <SkeletonBillDetails />
      </div>
    )
  }

  const isBillEmpty =
    commonUtil.isEmpty(billInfo) || commonUtil.isEmpty(billInfo.bills) || billInfo.totalAmount === 0
  if (isBillEmpty) {
    return (
      <State type={StateType.EMPTY_BILL} extraInfo={{ onButtonClick: onOtherPhoneNumberPay }} />
    )
  }

  return (
    <div className="md:pt-6">
      <FormProvider {...methods}>
        <BillInfoContext.Provider
          value={{
            billInfo,
          }}
        >
          <BillDetails />

          <InvoiceInput />
        </BillInfoContext.Provider>
      </FormProvider>
    </div>
  )
}
