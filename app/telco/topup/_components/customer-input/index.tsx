import PhoneNumberInput from '@/app/telco/_components/phone-number-input'
import { AppID } from '@/constants/telco'
import dynamic from 'next/dynamic'
import { useContext } from 'react'
import { defaultSupplier, TopupContext } from '../main'

const SupplierSelect = dynamic(() => import('../supplier-select'))

export default function CustomerInput() {
  const { suppliers, onSupplierChange } = useContext(TopupContext)

  return (
    <PhoneNumberInput
      appID={AppID.TOPUP}
      defaultSupplier={defaultSupplier}
      suppliers={suppliers}
      onSupplierChange={onSupplierChange}
    >
      <SupplierSelect />
    </PhoneNumberInput>
  )
}
