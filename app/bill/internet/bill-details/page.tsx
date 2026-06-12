'use client'

import billAPI from '@/api-client/bill'
import EmailInput from '@/app/bill/components/email-input'
import State, {
  mapStateViewByCodeAndReason,
  mapTitleByCodeAndReason,
} from '@/app/bill/components/state'
import SubmitButton from '@/app/bill/components/submit-button'
import SupplierHeader from '@/app/bill/components/supplier-header'
import { DialogState } from '@/components/common/dialog'
import { AppID, PaymentType, ProductID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import billModel from '@/models/bill'
import { useInternetStore } from '@/store/bill'
import { IBill, IError } from '@/types/bill'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import BillInfo from './components/bill-info'
import CustomerInfo from './components/customer-info'
import DebtInfo from './components/debt-info'
import PostpaidBill from './components/postpaid-bill'
import PrepaidBills from './components/prepaid-bills'
import GotItVoucherInput from '@/components/common/gotit-voucher-input'

const INTERNET_HOME_PATH = MAPPED_PATH[Domain.BILL][AppID.INTERNET]?.source || '/internet'

type FormValues = {
  email: string
  phoneNumber: string
  bills: IBill[]
  voucherCode: string
  amount: string
}
export default function BillDetail() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { supplier, billInfo } = useInternetStore()
  const [isLoading, setIsLoading] = useState(false)
  const [orderError, setOrderError] = useState<IError | undefined>(undefined)
  const phoneNumber = telcoUtil.formatPhoneNumber(searchParams?.get('phonenumber') ?? '')
  const utmSource = searchParams?.get('utm') ?? ''
  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
      phoneNumber,
      bills: [],
      voucherCode: '',
      amount: '0',
    } as FormValues,
  })
  const modeledBillInfo = billModel.modelBillInfo(billInfo)

  if (commonUtil.isEmpty(supplier) || commonUtil.isEmpty(modeledBillInfo)) {
    redirect(INTERNET_HOME_PATH)
  }

  const handleCloseClick = () => {
    router.replace(INTERNET_HOME_PATH)
  }

  if (orderError?.code) {
    const type = mapStateViewByCodeAndReason(orderError?.code || 200, orderError?.reason || '')

    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.INTERNET,
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

  // const handlePaymentClick = handleSubmit(async (data) => {
  //   if (isEmptyBills || isSubmitting) {
  //     location.replace('/internet')
  //     return
  //   }
  //   isSubmitting = true
  //   const bills = data.bills
  //   if (data.amount && bills?.length) {
  //     bills[0].amount = parseInt(commonUtil.formatNumber(data.amount), 10)
  //   }
  //   const order = {
  //     email: data.email,
  //     description: '',
  //     items: {
  //       bill_items: {
  //         app_id: billInfo.appID,
  //         supplier_id: billInfo.supplierID,
  //         provider_code: billInfo.providerCode,
  //         customer_code: billInfo.customerCode,
  //         customer_name: billInfo.customerName,
  //         customer_address: billInfo.address,
  //         bills,
  //       },
  //     },
  //   }
  //   try {
  //     await billAPI.createOrder({ appId: appID, order }).then((resp: any) => {
  //       window.location.href = resp.order_url
  //     })
  //   } catch (_error: any) {
  //     handleError(_error)
  //   }
  //   isSubmitting = false
  // })

  const handlePaymentClick = (failureCallback: (state: DialogState) => void) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    methods.handleSubmit(
      async (data) => {
        try {
          if (!modeledBillInfo) {
            return
          }
          const { email, amount } = data
          let bills = [modeledBillInfo.bills[0]]
          if (modeledBillInfo.paymentRule === PaymentType.PayAll) {
            bills = modeledBillInfo.bills
          } else if (
            modeledBillInfo.paymentRule === PaymentType.PostPaid &&
            amount &&
            bills?.length
          ) {
            bills[0].amount = parseInt(commonUtil.formatNumber(amount), 10)
          }
          const order = {
            email: email,
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
            appId: AppID.INTERNET,
            order,
            voucherCode: methods.getValues('voucherCode'),
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
      <div className="mb-3 text-xl font-bold md:mb-6 md:text-heading-lg">Chi tiết hóa đơn</div>

      {!commonUtil.isEmpty(supplier) && (
        <SupplierHeader supplier={supplier} alt="thanh-toan-cuoc-internet-online" />
      )}

      <FormProvider {...methods}>
        {(() => {
          if (!commonUtil.isEmpty(modeledBillInfo.bills)) {
            // if (modeledBillInfo.paymentRule === PaymentType.PayAll) {
            //   methods.setValue('bills', modeledBillInfo.bills)
            // } else {
            //   methods.setValue('bills', [modeledBillInfo.bills[0]])
            // }
            switch (modeledBillInfo.paymentRule) {
              case PaymentType.PrePaid:
                return <PrepaidBills billInfo={modeledBillInfo} />
              case PaymentType.PostPaid:
                return <PostpaidBill billInfo={modeledBillInfo} />
            }
          }
          return (
            <>
              <DebtInfo billInfo={modeledBillInfo} />

              <BillInfo billInfo={modeledBillInfo} />
            </>
          )
        })()}

        <CustomerInfo billInfo={modeledBillInfo} />

        {!isBillEmpty && (
          <FormProvider {...methods}>
            <EmailInput appID={AppID.INTERNET} />

            <GotItVoucherInput productID={ProductID.INTERNET} />
          </FormProvider>
        )}

        <SubmitButton
          text={isBillEmpty ? 'Đóng' : 'Thanh toán'}
          onClick={isBillEmpty ? handleCloseClick : handlePaymentClick}
        />
      </FormProvider>
    </div>
  )
}
