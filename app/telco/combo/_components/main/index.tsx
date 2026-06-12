'use client'

import comboAPI from '@/api-client/telco/combo'
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
import comboModel from '@/models/telco/combo'
import { DataPackage, DataSupplier } from '@/types/telco'
import telcoUtil from '@/utils/telco'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { createContext, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import CustomerInput from '../customer-input'
import Packages from '../packages'
import { StateType } from '../state'
import SkeletonState from '../state/skeleton-state'

const State = dynamic(() => import('../state'), {
  loading: () => <SkeletonState />,
})

export const defaultSupplier: DataSupplier = {
  telcoCode: TelcoCode.INVALID,
  status: SupplierStatus.INACTIVE,
  packageGroups: [
    {
      ID: 'GOI_DANH_RIENG_CHO_BAN',
      name: 'Gói dành riêng cho bạn',
      packages: [
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_T1',
          appID: AppID.COMBO,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'T1',
          name: 'T1',
          amount: 3000,
          capacity: {
            value: '',
            unit: '',
            display: '',
          },
          duration: {
            value: '',
            unit: '',
            display: '1 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: 'HOT',
          features: [
            {
              title: 'Truy cập',
              descriptions: ['Miễn phí lưu lượng data truy cập ứng dụng Tiktok.'],
            },
          ],
        },
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_T7',
          appID: AppID.COMBO,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'T7',
          name: 'T7',
          amount: 10000,
          capacity: {
            value: '',
            unit: '',
            display: '',
          },
          duration: {
            value: '',
            unit: '',
            display: '7 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [
            {
              title: 'Truy cập',
              descriptions: ['Miễn phí lưu lượng data truy cập ứng dụng Tiktok.'],
            },
          ],
        },
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_T30',
          appID: AppID.COMBO,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'T30',
          name: 'T30',
          amount: 30000,
          capacity: {
            value: '',
            unit: '',
            display: '',
          },
          duration: {
            value: '',
            unit: '',
            display: '30 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [
            {
              title: 'Truy cập',
              descriptions: ['Miễn phí lưu lượng data truy cập ứng dụng Tiktok.'],
            },
          ],
        },
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_1N_TMDT',
          appID: AppID.COMBO,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '1N_TMDT',
          name: '1N_TMDT',
          amount: 10000,
          capacity: {
            value: '',
            unit: '',
            display: '',
          },
          duration: {
            value: '',
            unit: '',
            display: '1 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [
            {
              title: 'Truy cập',
              descriptions: [
                '5GB.',
                'Miễn phí 10 phút/cuộc gọi nội mạng.',
                '5 phút gọi ngoại mạng.',
              ],
            },
          ],
        },
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_3N_TMDT',
          appID: AppID.COMBO,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '3N_TMDT',
          name: '3N_TMDT',
          amount: 30000,
          capacity: {
            value: '',
            unit: '',
            display: '',
          },
          duration: {
            value: '',
            unit: '',
            display: '30 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [
            {
              title: 'Truy cập',
              descriptions: [
                '15GB (5GB/ngày).',
                'Miễn phí 10 phút/cuộc gọi nội mạng.',
                'Miễn phí 15 phút cuộc gọi ngoại mạng.',
              ],
            },
          ],
        },
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_7N_TMDT',
          appID: AppID.COMBO,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: '7N_TMDT',
          name: '7N_TMDT',
          amount: 70000,
          capacity: {
            value: '',
            unit: '',
            display: '',
          },
          duration: {
            value: '',
            unit: '',
            display: '7 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [
            {
              title: 'Truy cập',
              descriptions: [
                '35GB (5GB/ngày).',
                'Miễn phí 10 phút/cuộc gọi nội mạng.',
                'Miễn phí 15 phút cuộc gọi ngoại mạng.',
              ],
            },
          ],
        },
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_FB7',
          appID: AppID.COMBO,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'FB7',
          name: 'FB7',
          amount: 10000,
          capacity: {
            value: '',
            unit: '',
            display: '',
          },
          duration: {
            value: '',
            unit: '',
            display: '7 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [
            {
              title: 'Truy cập',
              descriptions: [
                'Không giới hạn lưu lượng data truy cập Facebook và nhắn tin qua Facebook Messenger.',
              ],
            },
          ],
        },
        {
          ID: 'GOI_DANH_RIENG_CHO_BAN_FB30',
          appID: AppID.COMBO,
          telcoCode: TelcoCode.VIETTEL,
          type: DataPackageType.FIXED,
          code: 'FB30',
          name: 'FB30',
          amount: 30000,
          capacity: {
            value: '',
            unit: '',
            display: '',
          },
          duration: {
            value: '',
            unit: '',
            display: '30 ngày',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [
            {
              title: 'Truy cập',
              descriptions: [
                'Không giới hạn lưu lượng data truy cập Facebook và nhắn tin qua Facebook Messenger.',
              ],
            },
          ],
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

export const ComboContext = createContext({} as Context)

type FormValues = {
  phoneNumber: string
  package: DataPackage | undefined
  email: string
  voucherCode: string
}

export default function Main() {
  useLoadPageEventTracking({ appID: AppID.COMBO })
  const searchParams = useSearchParams()
  const phoneNumber = telcoUtil.formatPhoneNumber(searchParams?.get('phone_number') || '')
  const methods = useForm<FormValues>({
    defaultValues: {
      phoneNumber,
      package: undefined,
      email: '',
      voucherCode: '',
    } as FormValues,
  })
  const { data, error, isLoading } = useCustomSWR(
    API_PATH[AppID.COMBO].GET_SUPPLIERS,
    comboAPI.getSuppliers
  )
  const suppliers = comboModel.modelSuppliers(data)
  const [selectedSupplier, setSelectedSupplier] = useState<DataSupplier>(defaultSupplier)
  const packagesRef = useRef<HTMLUListElement | null>(null)

  const handleSupplierChange = (supplier: DataSupplier) => {
    methods.setValue('package', undefined)
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
      default:
        break
    }
  }

  return (
    <ErrorBoundary appID={AppID.COMBO}>
      <div className="hidden text-heading-lg md:mb-6 md:block">Nhập thông tin</div>

      <ComboContext.Provider
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

            if (selectedSupplier.status === SupplierStatus.UNSUPPORTED) {
              return (
                <State
                  type={StateType.UNSUPPORTED}
                  extraInfo={{ telcoCode: selectedSupplier.telcoCode }}
                />
              )
            }

            return <Packages innerRef={packagesRef} />
          })()}
        </FormProvider>
      </ComboContext.Provider>
    </ErrorBoundary>
  )
}
