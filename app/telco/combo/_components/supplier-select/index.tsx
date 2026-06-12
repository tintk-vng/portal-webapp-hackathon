'use client'

import SupplierDropDown from '@/app/telco/_components/supplier-dropdown'
import { AppID, PackageStatus, TelcoCode } from '@/constants/telco'
import telcoUtil from '@/utils/telco'
import { useSearchParams } from 'next/navigation'
import { Suspense, useContext, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { ComboContext } from '../main'

export default function SupplierSelect() {
  const searchParams = useSearchParams()
  const { getValues, setValue, setFocus } = useFormContext()
  const { isLoading, suppliers, selectedSupplier, onSupplierChange, onScrollToView } =
    useContext(ComboContext)

  const setDefaultParams = () => {
    try {
      const defaultPhoneNumber = getValues('phoneNumber')
      const defaultTelcoCode = searchParams?.get('telcocode') || ''
      const telcoCode =
        defaultTelcoCode in TelcoCode
          ? (defaultTelcoCode as TelcoCode)
          : telcoUtil.getTelcoCodeFromPhoneNumber(defaultPhoneNumber)
      const matchedSupplier = suppliers.find((supplier) => supplier.telcoCode === telcoCode)
      if (matchedSupplier) {
        onSupplierChange(matchedSupplier)
        const defaultPackageCode = searchParams?.get('packagecode')
        if (!defaultPackageCode) {
          return
        }
        matchedSupplier.packageGroups.forEach((packageGroup) => {
          const matchedPackage = packageGroup.packages.find(
            (dataPackage) =>
              dataPackage.code === defaultPackageCode && dataPackage.status === PackageStatus.ACTIVE
          )
          if (matchedPackage) {
            console.log('defaultPackage', matchedPackage)
            setValue('package', matchedPackage)
            onScrollToView('invoice-input')
            setTimeout(() => {
              setFocus('email')
            }, 500)
            return
          }
        })
      }
    } catch (error) {
      console.log('Failed to set default params: ', error)
    }
  }

  useEffect(() => {
    if (isLoading) {
      return
    }
    setDefaultParams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <Suspense fallback={null}>
      <SupplierDropDown
        appID={AppID.COMBO}
        suppliers={suppliers}
        selectedSupplier={selectedSupplier}
        onSupplierChange={onSupplierChange}
      />
    </Suspense>
  )
}
