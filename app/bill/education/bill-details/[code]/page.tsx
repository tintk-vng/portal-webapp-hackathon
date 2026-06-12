'use client'

import billAPI from '@/api-client/bill'
import EmailInput from '@/app/bill/components/email-input'
import State, {
  mapStateViewByCodeAndReason,
  mapTitleByCodeAndReason,
} from '@/app/bill/components/state'
import SubmitButton from '@/app/bill/components/submit-button'
import { DialogState } from '@/components/common/dialog'
import { AppID, PaymentType, ProductID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import billModel from '@/models/bill'
import educationModel from '@/models/bill/education'
import { useEducationStore } from '@/store/bill'
import { IError } from '@/types/bill'
import commonUtil from '@/utils/common'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import SupplierHeader from '../../../components/supplier-header'
import BillInfo from './components/bill-info'
import CustomerInfo from './components/customer-info'
import DebtInfo from './components/debt-info'
import PeriodSelect from './components/period-select'
import GotItVoucherInput from '@/components/common/gotit-voucher-input'

const EDUCATION_HOME_PATH = MAPPED_PATH[Domain.BILL][AppID.EDUCATION]?.source || '/hoc-phi'

interface FormValues {
  email: string
  bills: any
  voucherCode: string
}

export default function BillDetails() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  const { supplier, billInfo } = useEducationStore()
  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
      bills: [],
      voucherCode: '',
    } as FormValues,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [orderError, setOrderError] = useState<IError | undefined>(undefined)
  const modeledBillInfo = educationModel.modelBillInfo(billInfo)

  if (commonUtil.isEmpty(supplier) || commonUtil.isEmpty(modeledBillInfo)) {
    redirect(EDUCATION_HOME_PATH)
  }

  const handleCloseClick = () => {
    router.replace(EDUCATION_HOME_PATH)
  }

  if (orderError?.code) {
    const type = mapStateViewByCodeAndReason(orderError?.code || 200, orderError?.reason || '')
    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.EDUCATION,
          title:
            mapTitleByCodeAndReason(orderError?.code || 200, orderError?.reason || '') ||
            orderError.message ||
            '',
          description: orderError.description || '',
          onButtonClick: handleCloseClick,
        }}
      />
    )
  }

  const handlePaymentClick = (failureCallback: (state: DialogState) => void) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    methods.handleSubmit(
      async (data) => {
        try {
          const { email } = data
          let bills = [modeledBillInfo.bills[0]]
          if (modeledBillInfo.paymentRule === PaymentType.PayAll) {
            bills = modeledBillInfo.bills
          } else if (modeledBillInfo.paymentRule === PaymentType.PayBySelectedPeriod) {
            if (data.bills.length > 0) {
              bills = data.bills
            } else {
              bills = modeledBillInfo.bills
            }
          }
          const order = {
            email,
            description: '',
            items: {
              bill_items: {
                app_id: modeledBillInfo.appID,
                supplier_id: modeledBillInfo.supplierID,
                provider_code: modeledBillInfo.providerCode,
                customer_code: modeledBillInfo.customerCode,
                customer_name: modeledBillInfo.customerName,
                customer_address: modeledBillInfo.address,
                bills,
              },
            },
          }
          const reponse: any = await billAPI.createOrder({
            appId: AppID.EDUCATION,
            order,
            voucherCode: data.voucherCode || '',
            utmSource: utmSource,
          })
          window.location.href = reponse.order_url
        } catch (error: any) {
          console.log('Failed to create order: ', error)
          const errorCode = error.response.data.error.code
          if (errorCode < 500) {
            failureCallback({
              visible: true,
              description: error?.message,
            })
          } else {
            const updatedError = billModel.modelError(error.response.data.error)
            setOrderError(updatedError)
          }
          setIsLoading(false)
        }
      },
      (e) => {
        setIsLoading(false)
      }
    )()
  }

  const isBillEmpty = commonUtil.isEmpty(modeledBillInfo?.bills)

  return (
    <div>
      <SupplierHeader
        title="Chi tiết hóa đơn"
        supplier={supplier}
        alt="tra-cuu-thanh-toan-hoc-phi-online"
      />

      <FormProvider {...methods}>
        {(() => {
          if (isBillEmpty) {
            return (
              <>
                <DebtInfo billInfo={modeledBillInfo} />

                <BillInfo billInfo={modeledBillInfo} />
              </>
            )
          }
          if (PaymentType.PayBySelectedPeriod) {
            return <PeriodSelect billInfo={modeledBillInfo} />
          }
        })()}

        <CustomerInfo billInfo={modeledBillInfo} />
        {!isBillEmpty && (
          <>
            <EmailInput appID={AppID.EDUCATION} />

            <GotItVoucherInput productID={ProductID.EDUCATION} />
          </>
        )}
      </FormProvider>

      <SubmitButton
        text={isBillEmpty ? 'Đóng' : 'Thanh toán'}
        onClick={isBillEmpty ? handleCloseClick : handlePaymentClick}
      />
    </div>
  )
}
