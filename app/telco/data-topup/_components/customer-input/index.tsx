'use client'

import PhoneNumberInput from '@/app/telco/_components/phone-number-input'
import { AppID } from '@/constants/telco'
import { useContext } from 'react'
import { DataTopupContext, defaultSupplier } from '../main'
import SupplierSelect from '../supplier-select'

export default function CustomerInput() {
  const { suppliers, onSupplierChange } = useContext(DataTopupContext)

  return (
    <PhoneNumberInput
      appID={AppID.DATA_TOPUP}
      defaultSupplier={defaultSupplier}
      suppliers={suppliers}
      onSupplierChange={onSupplierChange}
    >
      <SupplierSelect />
    </PhoneNumberInput>
  )
}
