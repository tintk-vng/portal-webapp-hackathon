'use client'

import billAPI from '@/api-client/bill'
import State, {
  mapStateViewByCodeAndReason,
  mapTitleByCodeAndReason,
} from '@/app/bill/components/state'
import SubmitButton from '@/app/bill/components/submit-button'
import { DialogState } from '@/components/common/dialog'
import EmailInput from '@/app/bill/components/email-input'
import { AppID, PaymentType, ProductID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import billModel from '@/models/bill'
import { useApartmentStore } from '@/store/bill'
import { IError } from '@/types/bill'
import commonUtil from '@/utils/common'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import SupplierHeader from '../../../components/supplier-header'
import BillInfo from './components/bill-info'
import CustomerInfo from './components/customer-info'
import DebtInfo from './components/debt-info'
import GotItVoucherInput from '@/components/common/gotit-voucher-input'

const APARMENT_HOME_PATH = MAPPED_PATH[Domain.BILL][AppID.APARTMENT]?.source || '/chung-cu'

interface FormValues {
  email: string
  voucherCode: string
}

export default function BillDetails() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  const { supplier, billInfo } = useApartmentStore()
  if (commonUtil.isEmpty(supplier) || commonUtil.isEmpty(billInfo)) {
    redirect(APARMENT_HOME_PATH)
  }
  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
      voucherCode: '',
    } as FormValues,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [orderError, setOrderError] = useState<IError | undefined>(undefined)
  const modeledBillInfo = billModel.modelBillInfo(billInfo)

  const handleCloseClick = () => {
    router.replace(APARMENT_HOME_PATH)
  }

  if (orderError?.code) {
    const type = mapStateViewByCodeAndReason(orderError.code, orderError.reason || '')
    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.APARTMENT,
          title:
            mapTitleByCodeAndReason(orderError.code, orderError.reason || '') ||
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
          const { email, voucherCode } = data
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
                bills:
                  billInfo.paymentRule === PaymentType.PayAll
                    ? billInfo.bills
                    : [billInfo.bills[0]],
              },
            },
          }
          const reponse: any = await billAPI.createOrder({
            appId: AppID.APARTMENT,
            order,
            voucherCode: voucherCode || '',
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

  const isBillEmpty = commonUtil.isEmpty(modeledBillInfo.bills)

  return (
    <div>
      <SupplierHeader
        title="Chi tiết hóa đơn"
        supplier={supplier}
        alt="tra-cuu-thanh-toan-phi-chung-cu-online"
      />

      <DebtInfo billInfo={modeledBillInfo} />

      <BillInfo bills={modeledBillInfo.bills} />

      <CustomerInfo billInfo={modeledBillInfo} />

      {!isBillEmpty && (
        <FormProvider {...methods}>
          <EmailInput appID={AppID.APARTMENT} />
          <GotItVoucherInput productID={ProductID.APARTMENT} />
        </FormProvider>
      )}

      <SubmitButton
        text={isBillEmpty ? 'Đóng' : 'Thanh toán'}
        onClick={isBillEmpty ? handleCloseClick : handlePaymentClick}
      />
    </div>
  )
}
