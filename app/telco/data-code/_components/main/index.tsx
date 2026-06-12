'use client'

import dataCodeAPI from '@/api-client/telco/data-code'
import ErrorBoundary from '@/components/layout/error-boundary'
import {
  API_PATH,
  AppID,
  DataPackageType,
  PackageStatus,
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
      ID: 'GOI_DATA_NGAN_HAN',
      name: 'Gói Data Ngắn Hạn',
      packages: [
        {
          ID: 'GOI_DATA_NGAN_HAN_DC5',
          appID: AppID.DATA_CODE,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'DC5',
          name: '',
          amount: 5000,
          capacity: {
            value: '',
            unit: '',
            display: '250MB',
          },
          duration: {
            value: '',
            unit: '',
            display: '1 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_DATA_NGAN_HAN_DC10',
          appID: AppID.DATA_CODE,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'DC10',
          name: '',
          amount: 10000,
          capacity: {
            value: '',
            unit: '',
            display: '1GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '10 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: 'HOT',
          features: [],
        },
      ],
    },
    {
      ID: 'GOI_DATA_THANG',
      name: 'Gói Data Tháng',
      packages: [
        {
          ID: 'GOI_DATA_THANG_DataQT14',
          appID: AppID.DATA_CODE,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'DataQT14',
          name: '',
          amount: 14000,
          capacity: {
            value: '',
            unit: '',
            display: '1.4GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '10 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_DATA_THANG_DataQT28',
          appID: AppID.DATA_CODE,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'DataQT28',
          name: '',
          amount: 28000,
          capacity: {
            value: '',
            unit: '',
            display: '2.8GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '10 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_DATA_THANG_DataQT42',
          appID: AppID.DATA_CODE,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'DataQT42',
          name: '',
          amount: 42000,
          capacity: {
            value: '',
            unit: '',
            display: '4GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '30 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_DATA_THANG_DataQT56',
          appID: AppID.DATA_CODE,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'DataQT56',
          name: '',
          amount: 56000,
          capacity: {
            value: '',
            unit: '',
            display: '5GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '30 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_DATA_THANG_DataQT84',
          appID: AppID.DATA_CODE,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'DataQT84',
          name: '',
          amount: 84000,
          capacity: {
            value: '',
            unit: '',
            display: '8GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '30 ngày',
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

export const DataCodeContext = createContext({} as Context)

type FormValues = {
  supplier: DataSupplier
  package: DataPackage | undefined
  quantity: number
  email: string
  voucherCode: string
}

export default function Main() {
  useLoadPageEventTracking({ appID: AppID.DATA_CODE })
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
    API_PATH[AppID.DATA_CODE].GET_SUPPLIERS,
    dataCodeAPI.getSuppliers
  )
  const suppliers = telcoModel.modelSuppliers(data)
  const [selectedSupplier, setSelectedSupplier] = useState<DataSupplier>(defaultSupplier)
  const [amount, setAmount] = useState<number>(0)
  const supplierSelectRef = useRef<HTMLDivElement | null>(null)
  const packagesRef = useRef<HTMLUListElement | null>(null)

  const setDefaultPackage = (supplier: DataSupplier) => {
    try {
      const { packageGroups } = supplier
      const selectedDataCodePackage = methods.getValues('package')
      if (selectedDataCodePackage) {
        packageGroups.forEach((packageGroup) => {
          const matchedDataCodePackage = packageGroup.packages.find(
            (dataPackage) =>
              dataPackage.code === selectedDataCodePackage.code &&
              dataPackage.status === PackageStatus.ACTIVE
          )
          if (matchedDataCodePackage) {
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
    // methods.setValue('package', undefined)
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
          inline: 'center',
        })
        break
      case 'packages':
        packagesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
        break
      default:
        break
    }
  }

  return (
    <ErrorBoundary appID={AppID.DATA_CODE}>
      <div className="hidden text-heading-lg md:mb-6 md:block">Nhập thông tin</div>

      <DataCodeContext.Provider
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

            return <Packages innerRef={packagesRef} />
          })()}
        </FormProvider>
      </DataCodeContext.Provider>
    </ErrorBoundary>
  )
}
