'use client'

import phoneCardAPI from '@/api-client/telco/phone-card'
import QuantitySpinner from '@/app/telco/_components/quantity-spinner'
import GotItVoucherInput from '@/components/common/gotit-voucher-input'
import ErrorBoundary from '@/components/layout/error-boundary'
import {
  API_PATH,
  AppID,
  DataPackageType,
  PackageStatus,
  ProductID,
  SupplierStatus,
  TelcoCode,
} from '@/constants/telco'
import useCustomSWR from '@/hooks/use-custom-swr'
import { useLoadPageEventTracking } from '@/hooks/use-load-page-event-tracking'
import telcoModel from '@/models/telco'
import { DataPackage, DataSupplier } from '@/types/telco'
import dynamic from 'next/dynamic'
import { createContext, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import BuyNowButton from '../buy-now-button'
import InvoiceInput from '../invoice-input'
import Packages from '../packages'
import { StateType } from '../state'
import SkeletonState from '../state/skeleton-state'
import SupplierSelect from '../supplier-select'

const State = dynamic(() => import('../state'), {
  loading: () => <SkeletonState />,
})

export const defaultSupplier: DataSupplier = {
  telcoCode: TelcoCode.INVALID,
  status: SupplierStatus.INACTIVE,
  packageGroups: [
    {
      ID: 'CARD_VIETTEL',
      name: 'Thẻ Viettel',
      packages: [
        {
          ID: '853',
          appID: AppID.PHONE_CARD,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          amount: 10000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '854',
          appID: AppID.PHONE_CARD,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          amount: 20000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '855',
          appID: AppID.PHONE_CARD,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          amount: 50000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '856',
          appID: AppID.PHONE_CARD,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          amount: 100000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '857',
          appID: AppID.PHONE_CARD,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          amount: 200000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '858',
          appID: AppID.PHONE_CARD,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          amount: 500000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
      ],
    },
  ],
}

interface Context {
  isLoading: boolean
  suppliers: DataSupplier[]
  selectedSupplier: DataSupplier
  amount: number
  onAmountChange: (quantity: number) => void
  onSupplierChange: (supplier: DataSupplier) => void
  onScrollToView: (view: string) => void
}

export const PhoneCardContext = createContext({} as Context)

type FormValues = {
  supplier: DataSupplier
  package: DataPackage | undefined
  quantity: number
  email: string
  voucherCode: string
}

export default function Main() {
  useLoadPageEventTracking({ appID: AppID.PHONE_CARD })
  const methods = useForm<FormValues>({
    defaultValues: {
      supplier: defaultSupplier,
      package: undefined,
      quantity: 1,
      email: '',
      voucherCode: '',
    } as FormValues,
  })
  const { data, error, isLoading } = useCustomSWR(
    API_PATH[AppID.PHONE_CARD].GET_SUPPLIERS,
    phoneCardAPI.getSuppliers
  )
  const suppliers = telcoModel.modelSuppliers(data)
  const [selectedSupplier, setSelectedSupplier] = useState<DataSupplier>(defaultSupplier)
  const [amount, setAmount] = useState<number>(0)
  const supplierSelectRef = useRef<HTMLDivElement | null>(null)
  const packagesRef = useRef<HTMLDivElement | null>(null)
  const invoiceInputRef = useRef<HTMLInputElement | null>(null)

  const setDefaultPackage = (supplier: DataSupplier) => {
    try {
      const { packageGroups } = supplier
      const selectedPhoneCardPackage = methods.getValues('package')
      if (selectedPhoneCardPackage) {
        packageGroups.forEach((packageGroup) => {
          const matchedPhoneCardPackage = packageGroup.packages.find(
            (dataPackage) =>
              dataPackage.code === selectedPhoneCardPackage.code &&
              dataPackage.status === PackageStatus.ACTIVE
          )
          if (matchedPhoneCardPackage) {
            return
          }
        })
      }
      packageGroups.every((packageGroup) => {
        const activePackage = packageGroup.packages.find(
          (dataPackage) => dataPackage.status === PackageStatus.ACTIVE
        )
        if (activePackage) {
          methods.setValue('package', activePackage)
          const quantity = methods.getValues('quantity')
          setAmount(activePackage.amount * quantity)
          return false
        }
        return true
      })
    } catch (error) {
      console.log('Failed to set default package: ', error)
      methods.setValue('package', undefined)
      setAmount(0)
    }
  }

  const handleSupplierChange = (supplier: DataSupplier) => {
    methods.setValue('quantity', 1)
    setDefaultPackage(supplier)
    setSelectedSupplier(supplier)
  }

  const handleScrollToView = (view: string) => {
    switch (view) {
      case 'supplier-select':
        packagesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        break
      case 'packages':
        packagesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        break
      case 'invoice-input':
        invoiceInputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        break
      default:
        break
    }
  }

  return (
    <ErrorBoundary appID={AppID.PHONE_CARD}>
      <div className="hidden text-heading-lg md:mb-6 md:block">Nhập thông tin</div>

      <PhoneCardContext.Provider
        value={{
          isLoading,
          suppliers,
          selectedSupplier,
          amount,
          onAmountChange: setAmount,
          onSupplierChange: handleSupplierChange,
          onScrollToView: handleScrollToView,
        }}
      >
        <FormProvider {...methods}>
          <SupplierSelect innerRef={supplierSelectRef} />

          {(() => {
            if (error || selectedSupplier.status === SupplierStatus.MAINTENANCE) {
              return (
                <State
                  type={StateType.MAINTENANCE}
                  extraInfo={{ telcoCode: selectedSupplier.telcoCode }}
                />
              )
            }

            return (
              <>
                <Packages innerRef={packagesRef} />

                <QuantitySpinner appID={AppID.PHONE_CARD} onAmountChange={setAmount} />

                <InvoiceInput innerRef={invoiceInputRef} />

                <GotItVoucherInput productID={ProductID.PHONE_CARD} />

                <BuyNowButton />
              </>
            )
          })()}
        </FormProvider>
      </PhoneCardContext.Provider>
    </ErrorBoundary>
  )
}
