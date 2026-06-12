'use client'

import topupAPI from '@/api-client/telco/topup'
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
import CustomerInput from '../customer-input'
import InvoiceInput from '../invoice-input'
import Packages from '../packages'
import { StateType } from '../state'
import SkeletonState from '../state/skeleton-state'
import TopupNowButton from '../topup-now-button'

const State = dynamic(() => import('../state'), {
  loading: () => <SkeletonState />,
})
const GotItVoucherInput = dynamic(() => import('@/components/common/gotit-voucher-input'))

export const defaultSupplier: DataSupplier = {
  telcoCode: TelcoCode.INVALID,
  status: SupplierStatus.INACTIVE,
  packageGroups: [
    {
      ID: '',
      name: '',
      packages: [
        {
          ID: '853',
          appID: AppID.TOPUP,
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
          appID: AppID.TOPUP,
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
          appID: AppID.TOPUP,
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
          appID: AppID.TOPUP,
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
          appID: AppID.TOPUP,
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
          appID: AppID.TOPUP,
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
  onSupplierChange: (supplier: DataSupplier) => void
  onScrollToView: (view: string) => void
}

export const TopupContext = createContext({} as Context)

type FormValues = {
  phoneNumber: string
  package: DataPackage | undefined
  email: string
  voucherCode: string
}

export default function Main() {
  useLoadPageEventTracking({ appID: AppID.TOPUP })
  const { data, error, isLoading } = useCustomSWR(
    API_PATH[AppID.TOPUP].GET_SUPPLIERS,
    topupAPI.getSuppliers
  )
  const suppliers = telcoModel.modelSuppliers(data)
  const methods = useForm<FormValues>({
    defaultValues: {
      phoneNumber: '',
      package: undefined,
      email: '',
      voucherCode: '',
    } as FormValues,
  })
  const [selectedSupplier, setSelectedSupplier] = useState<DataSupplier>(defaultSupplier)
  const packagesRef = useRef<HTMLDivElement | null>(null)
  const invoiceInputRef = useRef<HTMLInputElement | null>(null)

  const setDefaultPackage = (supplier: DataSupplier) => {
    try {
      const { packageGroups } = supplier
      const selectedTopupPackage = methods.getValues('package')
      if (selectedTopupPackage) {
        packageGroups.forEach((packageGroup) => {
          const matchedTopupPackage = packageGroup.packages.find(
            (dataPackage) =>
              dataPackage.code === selectedTopupPackage.code &&
              dataPackage.status === PackageStatus.ACTIVE
          )
          if (matchedTopupPackage) {
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
          return false
        }
        return true
      })
    } catch (error) {
      console.log('Failed to set default package: ', error)
      methods.setValue('package', undefined)
    }
  }

  const handleSupplierChange = (supplier: DataSupplier) => {
    setDefaultPackage(supplier)
    setSelectedSupplier(supplier)
  }

  const handleScrollToView = (view: string) => {
    switch (view) {
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
    <ErrorBoundary appID={AppID.TOPUP}>
      <div className="hidden text-heading-lg md:mb-6 md:block">Nhập thông tin</div>

      <TopupContext.Provider
        value={{
          isLoading,
          suppliers,
          selectedSupplier,
          onSupplierChange: handleSupplierChange,
          onScrollToView: handleScrollToView,
        }}
      >
        <FormProvider {...methods}>
          <CustomerInput />

          {(() => {
            if (error || selectedSupplier.status === SupplierStatus.MAINTENANCE) {
              return (
                <State
                  type={StateType.MAINTENANCE}
                  extraInfo={{ telcoCode: selectedSupplier.telcoCode }}
                />
              )
            }

            if (
              selectedSupplier.telcoCode !== TelcoCode.INVALID &&
              selectedSupplier.status !== SupplierStatus.ACTIVE
            ) {
              return <State type={StateType.UNSUPPORTED} />
            }

            return (
              <>
                <Packages innerRef={packagesRef} />

                <InvoiceInput innerRef={invoiceInputRef} />

                <GotItVoucherInput productID={ProductID.TOPUP} />

                <TopupNowButton />
              </>
            )
          })()}
        </FormProvider>
      </TopupContext.Provider>
    </ErrorBoundary>
  )
}
