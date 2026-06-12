'use client'

import SupplierCards from '@/app/telco/_components/supplier-cards'
import { AppID, PackageStatus, SupplierStatus, TelcoCode } from '@/constants/telco'
import { DataSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import { useSearchParams } from 'next/navigation'
import { MutableRefObject, Suspense, useContext, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PhoneCardContext } from '../main'

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
  {
    telcoCode: TelcoCode.GMOBILE,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.VIETNAMOBILE,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.WINTEL,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
]

interface SupplierSelectProps {
  innerRef: MutableRefObject<HTMLDivElement | null>
}

export default function SupplierSelect({ innerRef }: SupplierSelectProps) {
  const searchParams = useSearchParams()
  const { setValue, setFocus } = useFormContext()
  const { isLoading, suppliers, selectedSupplier, onSupplierChange, onScrollToView } =
    useContext(PhoneCardContext)

  const setDefaultParams = () => {
    try {
      const defaultTelcoCode = searchParams?.get('telco_code') || ''
      const defaultAmount = Number(searchParams?.get('amount') || '0')
      const defaultEmail = commonUtil.b64DecodeUnicode(searchParams?.get('email') || '')
      const telcoCode =
        defaultTelcoCode in TelcoCode ? (defaultTelcoCode as TelcoCode) : TelcoCode.INVALID
      const matchedSupplier = suppliers.find((supplier) => supplier.telcoCode === telcoCode)
      if (matchedSupplier) {
        onSupplierChange(matchedSupplier)
        matchedSupplier.packageGroups.forEach((packageGroup) => {
          const matchedPackage = packageGroup.packages.find(
            (dataPackage) =>
              dataPackage.amount === defaultAmount && dataPackage.status === PackageStatus.ACTIVE
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
      if (defaultTelcoCode && defaultAmount && defaultEmail) {
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
    if (isLoading) {
      return
    }
    setDefaultParams()
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
        appID={AppID.PHONE_CARD}
        defaultSuppliers={defaultSuppliers}
        suppliers={suppliers}
        isLoading={isLoading}
        selectedSupplier={selectedSupplier}
        onSupplierChange={handleSupplierChange}
      />
    </Suspense>
  )
}
