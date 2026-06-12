'use client'

import SupplierDropDown from '@/app/telco/_components/supplier-dropdown'
import { AppID, PackageStatus, TelcoCode } from '@/constants/telco'
import telcoUtil from '@/utils/telco'
import { useSearchParams } from 'next/navigation'
import { Suspense, useContext, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { DataTopupContext } from '../main'

export default function SupplierSelect() {
  const searchParams = useSearchParams()
  const { setValue, setFocus } = useFormContext()
  const { isLoading, suppliers, selectedSupplier, onSupplierChange, onScrollToView } =
    useContext(DataTopupContext)

  const setDefaultParams = () => {
    try {
      const defaultPhoneNumber = searchParams?.get('phone_number') || ''
      const telcoCodeFromPhoneNumber = telcoUtil.getTelcoCodeFromPhoneNumber(defaultPhoneNumber)
      const defaultTelcoCode = searchParams?.get('telco_code') || ''
      let telcoCode = defaultTelcoCode
      if (telcoCodeFromPhoneNumber !== TelcoCode.INVALID) {
        setValue('phoneNumber', defaultPhoneNumber)
        telcoCode = telcoCodeFromPhoneNumber
      }
      const matchedSupplier = suppliers.find((supplier) => supplier.telcoCode === telcoCode)
      if (matchedSupplier) {
        onSupplierChange(matchedSupplier)
        const defaultPackageCode = searchParams?.get('packagecode')
        if (!defaultPackageCode) {
          return
        }
        matchedSupplier.packageGroups.every((packageGroup) => {
          const matchedPackage = packageGroup.packages.find(
            (dataPackage) =>
              dataPackage.code === defaultPackageCode && dataPackage.status === PackageStatus.ACTIVE
          )
          if (matchedPackage) {
            setValue('package', matchedPackage)
            onScrollToView('invoice-input')
            setTimeout(() => {
              setFocus('email')
            }, 500)
            return false
          }
          return true
        })
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
        appID={AppID.DATA_TOPUP}
        suppliers={suppliers}
        selectedSupplier={selectedSupplier}
        onSupplierChange={onSupplierChange}
      />
    </Suspense>
  )
}
