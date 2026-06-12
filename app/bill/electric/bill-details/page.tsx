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
import { AppID, ProductID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import billModel from '@/models/bill'
import { useElectricStore } from '@/store/bill'
import { IError, Supplier } from '@/types/bill'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import BillInfo from './components/bill-info'
import CustomerInfo from './components/customer-info'
import DebtInfo from './components/debt-info'

const GotItVoucherInput = dynamic(() => import('@/components/common/gotit-voucher-input'))

const ELECTRIC_HOME_PATH = MAPPED_PATH[Domain.BILL][AppID.ELECTRIC]?.source || '/dien'

interface FormValues {
  email: string
  voucherCode: string
}

export default function BillDetails() {
  const router = useRouter()
  const { billInfo } = useElectricStore()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  if (commonUtil.isEmpty(billInfo)) {
    redirect(ELECTRIC_HOME_PATH)
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
    router.replace(ELECTRIC_HOME_PATH)
  }

  if (orderError?.code) {
    const type = mapStateViewByCodeAndReason(orderError?.code || 200, orderError?.reason || '')

    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.ELECTRIC,
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
          const email = methods.getValues('email')
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
                bills: [modeledBillInfo.bills[0]],
              },
            },
          }
          const reponse: any = await billAPI.createOrder({
            appId: AppID.ELECTRIC,
            order,
            voucherCode: methods.getValues('voucherCode'),
            utmSource: utmSource,
          })
          setIsLoading(false)
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
        supplier={{ name: 'Tập đoàn điện lực Việt Nam', icon: 'EVN' } as Supplier}
        alt="tra-cuu-tien-dien-online"
      />

      <DebtInfo billInfo={modeledBillInfo} />

      <BillInfo bills={modeledBillInfo.bills} />

      <CustomerInfo
        fields={[
          { label: 'Mã khách hàng', value: modeledBillInfo.customerCode },
          { label: 'Tên khách hàng', value: modeledBillInfo.customerName },
          { label: 'Địa chỉ', value: modeledBillInfo.address },
        ]}
      />

      {!isBillEmpty && (
        <FormProvider {...methods}>
          <EmailInput appID={AppID.ELECTRIC} />

          <GotItVoucherInput productID={ProductID.ELECTRIC} />
        </FormProvider>
      )}

      <SubmitButton
        text={isBillEmpty ? 'Đóng' : 'Thanh toán'}
        onClick={isBillEmpty ? handleCloseClick : handlePaymentClick}
      />
    </div>
  )
}
