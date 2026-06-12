'use client'

import SupplierCards from '@/app/telco/_components/supplier-cards'
import { AppID, PackageStatus, SupplierStatus, TelcoCode } from '@/constants/telco'
import { DataSupplier } from '@/types/telco'
import telcoUtil from '@/utils/telco'
import { useSearchParams } from 'next/navigation'
import { MutableRefObject, Suspense, useContext, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { DataCodeContext } from '../main'

const defaultSuppliers: DataSupplier[] = [
  {
    telcoCode: TelcoCode.VIETTEL,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.MOBIFONE,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.VINAPHONE,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
]

interface SupplierSelectProps {
  innerRef: MutableRefObject<HTMLDivElement | null>
}

export default function SupplierSelect({ innerRef }: SupplierSelectProps) {
  const searchParams = useSearchParams()
  const { isLoading, suppliers, selectedSupplier, onSupplierChange, onScrollToView } =
    useContext(DataCodeContext)
  const { setValue, setFocus } = useFormContext()

  const setDefaultParams = () => {
    try {
      const defaultPhoneNumber = searchParams?.get('phone_number') || ''
      const defaultTelcoCode = searchParams?.get('telco_code') || ''
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
    if (!isLoading) {
      setDefaultParams()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const handleSupplierChange = (supplier: DataSupplier) => {
    onSupplierChange(supplier)
    onScrollToView('packages')
  }

  return (
    <Suspense fallback={null}>
      <SupplierCards
        innerRef={innerRef}
        appID={AppID.DATA_CODE}
        defaultSuppliers={defaultSuppliers}
        suppliers={suppliers}
        isLoading={isLoading}
        selectedSupplier={selectedSupplier}
        onSupplierChange={handleSupplierChange}
      />
    </Suspense>
  )
}
