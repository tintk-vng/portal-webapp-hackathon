'use client'

import SupplierDropDown from '@/app/telco/_components/supplier-dropdown'
import { AppID } from '@/constants/telco'
import { PostPaidSupplier } from '@/types/telco'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { PostPaidContext } from '../main'

export default function SupplierSelect() {
  const { setValue } = useFormContext()
  const {
    suppliers,
    billInfoState,
    selectedSupplier,
    onBillInfoStateChange,
    onSupplierChange,
    onCaptchaChange,
  } = useContext(PostPaidContext)

  const handleSupplierChange = (supplier: PostPaidSupplier) => {
    if (billInfoState.billInfo) {
      setValue('captchaCode', '')
      onCaptchaChange(undefined)
      onBillInfoStateChange({
        billInfo: undefined,
        isLoading: false,
        error: undefined,
      })
    }
    onSupplierChange(supplier)
  }

  return (
    <SupplierDropDown
      appID={AppID.POST_PAID}
      suppliers={suppliers}
      selectedSupplier={selectedSupplier}
      onSupplierChange={handleSupplierChange}
    />
  )
}
