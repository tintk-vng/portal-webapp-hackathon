import { AppID, PackageStatus, TelcoCode } from '@/constants/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Suspense, useContext, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { TopupContext } from '../main'

const SupplierDropDown = dynamic(() => import('@/app/telco/_components/supplier-dropdown'))

function Main() {
  const searchParams = useSearchParams()
  const { setValue, setFocus } = useFormContext()
  const { isLoading, suppliers, selectedSupplier, onSupplierChange, onScrollToView } =
    useContext(TopupContext)

  const setDefaultParams = () => {
    try {
      const defaultPhoneNumber = searchParams?.get('phone_number') || ''
      const defaultTelcoCode = searchParams?.get('telco_code') || ''
      const defaultAmount = Number(searchParams?.get('amount') || '0')
      const defaultEmail = commonUtil.b64DecodeUnicode(searchParams?.get('email') || '')
      const telcoCodeFromPhoneNumber = telcoUtil.getTelcoCodeFromPhoneNumber(defaultPhoneNumber)
      if (telcoCodeFromPhoneNumber !== TelcoCode.INVALID) {
        setValue('phoneNumber', defaultPhoneNumber)
      }
      const telcoCode = defaultTelcoCode in TelcoCode ? defaultTelcoCode : telcoCodeFromPhoneNumber
      const matchedSupplier = suppliers.find((supplier) => supplier.telcoCode === telcoCode)
      if (matchedSupplier) {
        onSupplierChange(matchedSupplier)
        matchedSupplier.packageGroups.forEach((packageGroup) => {
          const matchedPackage = packageGroup.packages.find(
            (topupPackage) =>
              topupPackage.amount === defaultAmount && topupPackage.status === PackageStatus.ACTIVE
          )
          if (matchedPackage) {
            setValue('package', matchedPackage)
            onScrollToView('invoice-input')
            setTimeout(() => {
              setFocus('email')
            }, 500)
            return
          }
        })
      }
      setValue('email', defaultEmail)
      if (defaultPhoneNumber && defaultAmount && defaultEmail) {
        setTimeout(() => {
          const paymentButton = document.getElementById('telco-one-click-payment-button')
          paymentButton?.click()
        }, 500)
      }
    } catch (error) {
      console.log('Failed to set default params: ', error)
    }
  }

  useEffect(() => {
    if (!isLoading) {
      setDefaultParams()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <Suspense fallback={null}>
      <SupplierDropDown
        appID={AppID.TOPUP}
        suppliers={suppliers}
        selectedSupplier={selectedSupplier}
        onSupplierChange={onSupplierChange}
      />
    </Suspense>
  )
}

export default function SupplierSelect() {
  return (
    <Suspense fallback={null}>
      <Main />
    </Suspense>
  )
}
