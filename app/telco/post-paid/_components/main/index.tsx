'use client'

import postPaidAPI from '@/api-client/telco/post-paid'
import ErrorBoundary from '@/components/layout/error-boundary'
import { API_PATH, AppID, SupplierStatus, TelcoCode } from '@/constants/telco'
import useCustomSWR from '@/hooks/use-custom-swr'
import { useLoadPageEventTracking } from '@/hooks/use-load-page-event-tracking'
import postPaidModel from '@/models/telco/post-paid'
import { Captcha } from '@/types/common'
import { BillInfo as IBillInfo, PostPaidSupplier } from '@/types/telco'
import dynamic from 'next/dynamic'
import { createContext, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import SkeletonBillInfo from '../bill-info/skeleton-bill-info'
import CustomerInput from '../customer-input'
import State, { StateType } from '../state'

const BillInfo = dynamic(() => import('../bill-info'), {
  loading: () => <SkeletonBillInfo />,
})

type FormValues = {
  phoneNumber: string
  captchaCode: string
}

export interface BillInfoState {
  billInfo: IBillInfo | undefined
  isLoading: boolean
  error: any
}

interface Context {
  suppliers: PostPaidSupplier[]
  billInfoState: BillInfoState
  selectedSupplier: PostPaidSupplier
  captcha: Captcha | undefined
  onBillInfoStateChange: (billInfoState: BillInfoState) => void
  onSupplierChange: (supplier: PostPaidSupplier) => void
  onCaptchaChange: (captcha: Captcha | undefined) => void
}

export const PostPaidContext = createContext({} as Context)

export default function Main() {
  useLoadPageEventTracking({ appID: AppID.POST_PAID })
  const methods = useForm<FormValues>({
    defaultValues: {
      phoneNumber: '',
      captchaCode: '',
    } as FormValues,
  })
  const { data, error } = useCustomSWR(
    API_PATH[AppID.POST_PAID].GET_SUPPLIERS,
    postPaidAPI.getSuppliers
  )
  const suppliers = postPaidModel.modelSuppliers(data)
  const [billInfoState, setBillInfoState] = useState<BillInfoState>({
    billInfo: undefined,
    isLoading: false,
    error: undefined,
  })
  const [selectedSupplier, setSelectedSupplier] = useState<PostPaidSupplier>({} as PostPaidSupplier)
  const [captcha, setCaptcha] = useState<Captcha | undefined>(undefined)
  const customerInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <ErrorBoundary appID={AppID.POST_PAID}>
      <div className="hidden text-heading-lg md:mb-6 md:block">Thông tin hoá đơn</div>

      <PostPaidContext.Provider
        value={{
          suppliers,
          billInfoState,
          selectedSupplier,
          captcha,
          onBillInfoStateChange: setBillInfoState,
          onSupplierChange: setSelectedSupplier,
          onCaptchaChange: setCaptcha,
        }}
      >
        <FormProvider {...methods}>
          <CustomerInput ref={customerInputRef} />
        </FormProvider>
      </PostPaidContext.Provider>

      {(() => {
        const { getValues } = methods
        const selectedTelcoCode = selectedSupplier.telcoCode
        if (error) {
          return <State type={StateType.MAINTENANCE} extraInfo={{ telcoCode: selectedTelcoCode }} />
        }

        const selectedPhoneNumber = getValues('phoneNumber')
        const isValidPhoneNumber =
          selectedTelcoCode !== TelcoCode.INVALID && selectedPhoneNumber.length === 10
        if (!isValidPhoneNumber) {
          return <State type={StateType.EMPTY_PHONE_NUMBER} />
        }

        const matchedSupplier =
          suppliers.find((supplier) => supplier.telcoCode === selectedTelcoCode) ||
          ({} as PostPaidSupplier)
        if (matchedSupplier.status !== SupplierStatus.ACTIVE) {
          if (matchedSupplier.status === SupplierStatus.MAINTENANCE) {
            return (
              <State type={StateType.MAINTENANCE} extraInfo={{ telcoCode: selectedTelcoCode }} />
            )
          } else {
            return <State type={StateType.UNSUPPORTED} />
          }
        }

        if (!billInfoState.billInfo) {
          return null
        }

        const handleOtherPhoneNumberPay = () => {
          methods.reset()
          setCaptcha(undefined)
          customerInputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          })
          setTimeout(() => {
            methods.setFocus('phoneNumber')
          }, 500)
        }

        return (
          <BillInfo
            billInfoState={billInfoState}
            telcoCode={selectedTelcoCode}
            onOtherPhoneNumberPay={handleOtherPhoneNumberPay}
          />
        )
      })()}
    </ErrorBoundary>
  )
}
