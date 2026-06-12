'use client'

import { TELCO_NAME, TelcoCode } from '@/constants/telco'
import { SOF } from '@/types/common'
import { DataPackage, DataSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import { MutableRefObject } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import BuyNowButton from '../buy-now-button'
import QuantitySpinner from '../quantity-spinner'
import { StateType } from '../state'

interface OrderDetailsProps {
  innerRef: MutableRefObject<HTMLDivElement | null>
}

export default function OrderDetails({ innerRef }: OrderDetailsProps) {
  const { control } = useFormContext()
  const stateType = useWatch({
    control,
    name: 'stateType',
  }) as StateType
  const selectedPackage = useWatch({
    control,
    name: 'package',
  }) as DataPackage
  const email = useWatch({
    control,
    name: 'email',
  }) as string
  const selectedSupplier = useWatch({
    control,
    name: 'supplier',
  }) as DataSupplier
  const quantityFromForm = useWatch({
    control,
    name: 'quantity',
  }) as number
  const isGooglePlay = selectedSupplier?.telcoCode === TelcoCode.GOOGLEPLAY
  const quantity = isGooglePlay ? 1 : quantityFromForm
  const selectedSOF = useWatch({
    control,
    name: 'SOF',
  }) as SOF
  const originalAmount = selectedPackage.originalAmount ?? 0
  let orderDetails: {
    telcoCode: string
    amount: number
    discountAmount: number
    SOFName: string
    totalAmount: number
    email: string
  } = {
    telcoCode:
      selectedPackage.telcoCode === TelcoCode.INVALID
        ? ''
        : TELCO_NAME[selectedPackage.telcoCode] || selectedPackage.telcoCode,
    amount: originalAmount > 0 ? originalAmount : selectedPackage.amount,
    discountAmount:
      selectedPackage.originalAmount && selectedPackage.originalAmount > selectedPackage.amount
        ? (selectedPackage.originalAmount - selectedPackage.amount) * quantity
        : 0,
    SOFName: selectedSOF.name,
    totalAmount: selectedPackage.amount * quantity,
    email,
  }

  if (stateType === StateType.MAINTENANCE || commonUtil.isEmpty(selectedPackage)) {
    orderDetails = {
      ...orderDetails,
      telcoCode: '',
      amount: 0,
      discountAmount: 0,
      totalAmount: 0,
      email: '',
    }
  }

  return (
    <div ref={innerRef}>
      <div className="mb-2 text-heading-md md:mb-3 md:text-heading-sm">Chi tiết giao dịch</div>

      <div className="md:rounded-lg md:border md:border-dark-50 md:px-4 md:py-1">
        <div className="flex h-11 items-center justify-between md:h-12">
          <label className="text-label-lg text-dark-300">Loại mã thẻ</label>

          <label className="text-label-lg">{orderDetails.telcoCode}</label>
        </div>

        <div className="flex h-11 items-center justify-between md:h-12">
          <label className="text-label-lg text-dark-300">Mệnh giá thẻ</label>

          <label className="text-label-lg">{commonUtil.formatCurrency(orderDetails.amount)}</label>
        </div>

        <div className="flex h-11 items-center justify-between md:h-12">
          <label className="text-label-lg text-dark-300">Số lượng</label>

          <QuantitySpinner />
        </div>

        {orderDetails.discountAmount > 0 && (
          <div className="flex h-11 items-center justify-between md:h-12">
            <label className="text-label-lg text-dark-300">Giảm giá</label>

            <label className="text-label-lg text-green-600">
              -{commonUtil.formatCurrency(orderDetails.discountAmount)}
            </label>
          </div>
        )}

        <div className="flex h-11 items-center justify-between md:h-12">
          <label className="text-label-lg text-dark-300">Nguồn tiền</label>

          <label className="text-label-lg">{orderDetails.SOFName}</label>
        </div>

        <div className="flex h-11 items-center justify-between border-t border-t-dark-50 md:h-12">
          <label className="text-label-lg text-dark-300">Thành tiền</label>

          <label className="text-label-lg font-bold">
            {commonUtil.formatCurrency(orderDetails.totalAmount)}
          </label>
        </div>

        <div className="flex h-11 items-center justify-between md:mb-4 md:h-12 md:border-b md:border-b-dark-50">
          <label className="flex-1 text-label-lg text-dark-300">Email nhận thẻ</label>

          <label className="flex-1 truncate text-right text-label-lg font-bold">
            {orderDetails.email}
          </label>
        </div>

        <BuyNowButton />
      </div>
    </div>
  )
}
