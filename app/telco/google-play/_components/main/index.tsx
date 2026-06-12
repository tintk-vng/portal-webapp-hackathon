'use client'

import googlePlayAPI from '@/api-client/telco/google-play'
import GotItVoucherInput from '@/components/common/gotit-voucher-input'
import GooglePlayTutorial from '@/components/common/google-play-tutorial'
import ErrorBoundary from '@/components/layout/error-boundary'
import { API_PATH, AppID, ProductID, SupplierStatus } from '@/constants/telco'
import useCustomSWR from '@/hooks/use-custom-swr'
import { useLoadPageEventTracking } from '@/hooks/use-load-page-event-tracking'
import telcoModel from '@/models/telco'
import { DataPackage, DataSupplier } from '@/types/telco'
import dynamic from 'next/dynamic'
import { createContext, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import BuyNowButton from '../buy-now-button'
import InvoiceInput from '../invoice-input'
import Packages from '../packages'
import { StateType } from '../state'
import SkeletonState from '../state/skeleton-state'

const State = dynamic(() => import('../state'), {
  loading: () => <SkeletonState />,
})

interface Context {
  isLoading: boolean
  suppliers: DataSupplier[]
  selectedSupplier: DataSupplier
  amount: number
  onAmountChange: (quantity: number) => void
  onScrollToView: (view: string) => void
}

export const GooglePlayContext = createContext({} as Context)

type FormValues = {
  supplier: DataSupplier
  package: DataPackage | undefined
  quantity: number
  email: string
  voucherCode: string
}

export default function Main() {
  useLoadPageEventTracking({ appID: AppID.GOOGLEPLAY })
  const methods = useForm<FormValues>({
    defaultValues: {
      supplier: {},
      package: undefined,
      quantity: 1,
      email: '',
      voucherCode: '',
    } as FormValues,
  })
  const { data, error, isLoading } = useCustomSWR(
    API_PATH[AppID.GOOGLEPLAY].GET_SUPPLIERS,
    googlePlayAPI.getSuppliers
  )
  const suppliers = telcoModel.modelSuppliers(data)
  const [selectedSupplier, setSelectedSupplier] = useState<DataSupplier>({} as DataSupplier)
  const [amount, setAmount] = useState<number>(0)
  const packagesRef = useRef<HTMLDivElement | null>(null)
  const invoiceInputRef = useRef<HTMLInputElement | null>(null)
  const tutorialInputRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isLoading) {
      setSelectedSupplier(suppliers[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

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
      case 'tutorial':
        tutorialInputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        break
      default:
        break
    }
  }

  return (
    <ErrorBoundary appID={AppID.GOOGLEPLAY}>
      <div className="hidden text-heading-lg md:mb-6 md:block">Nhập thông tin</div>

      <GooglePlayContext.Provider
        value={{
          isLoading,
          suppliers,
          selectedSupplier,
          amount,
          onAmountChange: setAmount,
          onScrollToView: handleScrollToView,
        }}
      >
        <FormProvider {...methods}>
          {(() => {
            if (error || selectedSupplier.status === SupplierStatus.MAINTENANCE) {
              return <State type={StateType.MAINTENANCE} />
            }

            return (
              <>
                <Packages innerRef={packagesRef} />

                <InvoiceInput innerRef={invoiceInputRef} />

                <GotItVoucherInput productID={ProductID.GOOGLEPLAY} />

                <BuyNowButton />

                <div ref={tutorialInputRef}>
                  <GooglePlayTutorial />
                </div>
              </>
            )
          })()}
        </FormProvider>
      </GooglePlayContext.Provider>
    </ErrorBoundary>
  )
}
