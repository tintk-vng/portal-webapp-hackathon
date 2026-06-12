'use client'

import dataTopupAPI from '@/api-client/telco/data-topup'
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
import commonUtil from '@/utils/common'
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
      ID: 'GOI_DANH_RIENG_CHO_BAN',
      name: 'Gói dành riêng cho bạn',
      packages: [
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_G3DS',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'G3DS',
          name: '',
          amount: 9000,
          capacity: {
            value: '',
            unit: '',
            display: '3GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '3 giờ',
          },
          status: PackageStatus.ACTIVE,
          badgeText: 'HOT',
          features: [],
        },
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_ST15KDS',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'ST15KDS',
          name: '',
          amount: 15000,
          capacity: {
            value: '',
            unit: '',
            display: '3GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '3 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: 'HOT',
          features: [],
        },
      ],
    },
    {
      ID: 'GOI_PHO_BIEN',
      name: 'Gói Phổ Biến',
      packages: [
        {
          ID: 'GOI_PHO_BIEN_H5DS',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'H5DS',
          name: '',
          amount: 5000,
          capacity: {
            value: '',
            unit: '',
            display: '1GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '1 giờ',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_PHO_BIEN_ST10KDS',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'ST10KDS',
          name: '',
          amount: 10000,
          status: PackageStatus.ACTIVE,
          capacity: {
            value: '',
            unit: '',
            display: '2GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '1 ngày',
          },
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_PHO_BIEN_ST30KDS',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'ST30KDS',
          name: '',
          amount: 30000,
          capacity: {
            value: '',
            unit: '',
            display: '7GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '7 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_PHO_BIEN_ST120KDS',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'ST120KDS',
          name: '',
          amount: 120000,
          capacity: {
            value: '',
            unit: '',
            display: '7GB',
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
    {
      ID: 'GOI_DATA_THANG',
      name: 'Gói Data Tháng',
      packages: [
        {
          ID: 'GOI_DATA_THANG_ST90KDS',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'ST90KDS',
          name: '',
          amount: 90000,
          capacity: {
            value: '',
            unit: '',
            display: '3GB',
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
          ID: 'GOI_DATA_THANG_ST150KDS',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'ST150KDS',
          name: '',
          amount: 150000,
          capacity: {
            value: '',
            unit: '',
            display: '90GB',
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
    {
      ID: 'GOI_DATA_NGAN_HAN',
      name: 'Gói Data Ngắn Hạn',
      packages: [
        {
          ID: 'GOI_DATA_NGAN_HAN_ST5KDS',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'ST5KDS',
          name: '',
          amount: 5000,
          capacity: {
            value: '',
            unit: '',
            display: '500MB',
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
          ID: 'GOI_DATA_NGAN_HAN_5M7N',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '5M7N',
          name: '',
          amount: 10000,
          capacity: {
            value: '',
            unit: '',
            display: '500MB',
          },
          duration: {
            value: '',
            unit: '',
            display: '7 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_DATA_NGAN_HAN_1G7N',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '1G7N',
          name: '',
          amount: 17000,
          capacity: {
            value: '',
            unit: '',
            display: '1GB',
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
          ID: 'GOI_DATA_NGAN_HAN_2G7N',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '2G7N',
          name: '',
          amount: 29000,
          capacity: {
            value: '',
            unit: '',
            display: '2GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '7 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: 'GOI_DATA_NGAN_HAN_3G7N',
          appID: AppID.DATA_TOPUP,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '3G7N',
          name: '',
          amount: 38000,
          capacity: {
            value: '',
            unit: '',
            display: '3GB',
          },
          duration: {
            value: '',
            unit: '',
            display: '7 ngày',
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

export const DataTopupContext = createContext({} as Context)

type FormValues = {
  phoneNumber: string
  package: DataPackage | undefined
  email: string
  voucherCode: string
}

export default function Main() {
  useLoadPageEventTracking({ appID: AppID.DATA_TOPUP })
  const methods = useForm<FormValues>({
    defaultValues: {
      phoneNumber: '',
      package: undefined,
      email: '',
      voucherCode: '',
    } as FormValues,
  })
  const { data, error, isLoading } = useCustomSWR(
    API_PATH[AppID.DATA_TOPUP].GET_SUPPLIERS,
    dataTopupAPI.getSuppliers
  )
  const suppliers = telcoModel.modelSuppliers(data)
  const [selectedSupplier, setSelectedSupplier] = useState<DataSupplier>(defaultSupplier)
  const packagesRef = useRef<HTMLUListElement | null>(null)
  const invoiceInputRef = useRef<HTMLInputElement | null>(null)

  const setDefaultPackage = (supplier: DataSupplier) => {
    try {
      const { packageGroups } = supplier
      const selectedDataTopupPackage = methods.getValues('package')
      if (selectedDataTopupPackage) {
        let matchedDataTopupPackage
        packageGroups.forEach((packageGroup) => {
          matchedDataTopupPackage = packageGroup.packages.find(
            (dataPackage) =>
              dataPackage.ID === selectedDataTopupPackage.ID &&
              dataPackage.status === PackageStatus.ACTIVE
          )
          if (matchedDataTopupPackage) {
            return
          }
        })
      }

      packageGroups.every((packageGroup) => {
        const activeDataTopupPackage = packageGroup.packages.find(
          (dataPackage) => dataPackage.status === PackageStatus.ACTIVE
        )
        if (activeDataTopupPackage) {
          methods.setValue('package', activeDataTopupPackage)
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
    methods.setValue('package', undefined)
    setDefaultPackage(supplier)
    setSelectedSupplier(supplier)
  }

  const handleScrollToView = (view: string) => {
    switch (view) {
      case 'packages':
        packagesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
        break
      case 'invoice-input':
        invoiceInputRef.current?.scrollIntoView({
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
    <ErrorBoundary appID={AppID.DATA_TOPUP}>
      <div className="hidden text-heading-lg md:mb-6 md:block">Nhập thông tin</div>

      <DataTopupContext.Provider
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

            const packageGroups =
              suppliers.find((supplier) => supplier.telcoCode === selectedSupplier.telcoCode)
                ?.packageGroups || selectedSupplier.packageGroups
            if (commonUtil.isEmpty(packageGroups)) {
              return (
                <State
                  type={StateType.UNSUPPORTED}
                  extraInfo={{ telcoCode: selectedSupplier.telcoCode }}
                />
              )
            }

            return (
              <>
                <Packages innerRef={packagesRef} />

                <InvoiceInput innerRef={invoiceInputRef} />

                <GotItVoucherInput productID={ProductID.DATA_TOPUP} />

                <TopupNowButton />
              </>
            )
          })()}
        </FormProvider>
      </DataTopupContext.Provider>
    </ErrorBoundary>
  )
}
