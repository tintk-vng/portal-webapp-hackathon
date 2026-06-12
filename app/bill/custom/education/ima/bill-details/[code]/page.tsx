'use client'

import billAPI from '@/api-client/bill'
import State, {
  mapStateViewByCodeAndReason,
  mapTitleByCodeAndReason,
} from '@/app/bill/components/state'
import { DialogState } from '@/components/common/dialog'
import { AppID, THEME_COLOR } from '@/constants/bill'
import billModel from '@/models/bill'
import educationModel from '@/models/bill/education'
import { useEducationStore } from '@/store/bill'
import { IError } from '@/types/bill'
import commonUtil from '@/utils/common'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import CustomerInfo from './components/customer-info'
import DebtInfo from './components/debt-info'
import SupplierHeader from '@/app/bill/components/supplier-header'
import EmailInput from '../../../../components/email-input'
import SubmitButton from '../../../../components/submit-button'
import Policy from '../../../../components/policy'
import iconExpand from '../../../../../../../public/images/icons/ima_expand_arrow.svg'
const EDUCATION_HOME_PATH = '/hoc-phi/ima?supplierid=910'
const POLICY_URL = 'https://scdn.zalopay.com.vn/zst/zpi/images/bill/file/ima-policy.pdf'
interface FormValues {
  email: string
  amount: number
  voucherCode: string
}

export default function BillDetails() {
  const router = useRouter()
  const { supplier, billInfo } = useEducationStore()
  const searchParams = useSearchParams()
  const studentCode = searchParams?.get('student_code') || ''
  const campusCode = searchParams?.get('campus_code') || ''
  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
      amount: 0,
      voucherCode: '',
    } as FormValues,
  })
  const [policyChecked, setPolicyChecked] = useState(false)
  const [inputError, setInputError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orderError, setOrderError] = useState<IError | undefined>(undefined)
  const modeledBillInfo = educationModel.modelBillInfo(billInfo)

  if (commonUtil.isEmpty(supplier) || commonUtil.isEmpty(modeledBillInfo)) {
    let path = EDUCATION_HOME_PATH + `&student_code=${studentCode}`
    if (campusCode) {
      path += `&campus_code=${campusCode}`
    }
    redirect(path)
  }

  const handleCloseClick = () => {
    let path = EDUCATION_HOME_PATH + `&student_code=${studentCode}`
    if (campusCode) {
      path += `&campus_code=${campusCode}`
    }
    router.replace(path)
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

    methods.handleSubmit(
      async (data) => {
        try {
          if (data.amount === 0) {
            setInputError('Vui lòng nhập số tiền')
            return
          } else if (data.amount < 100000) {
            setInputError('Cần tối thiểu 100.000đ để thực hiện giao dịch')
            return
          }
          setIsLoading(true)
          const { email } = data
          let bills = [{ ...modeledBillInfo.bills[0], amount: data.amount }]
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

  const onUpdatePolicyChecked = (checked: boolean) => {
    setPolicyChecked(checked)
  }

  const onInputAmountChange = () => {
    setInputError('')
  }

  const onBack = () => {
    history.back()
  }

  const isBillEmpty = commonUtil.isEmpty(modeledBillInfo?.bills)

  return (
    <div>
      <div className="relative rounded-2xl bg-white px-[64px] py-[32px] shadow-[0_0px_2px_0_rgba(0,0,0,0.1),_0_1px_5px_0_rgba(0,0,0,0.1)]">
        <SupplierHeader
          title="Chi tiết hóa đơn"
          supplier={supplier}
          alt="tra-cuu-thanh-toan-hoc-phi-uts"
          onBack={onBack}
        />
        <FormProvider {...methods}>
          <DebtInfo
            onChange={onInputAmountChange}
            inputError={inputError}
            billInfo={modeledBillInfo}
          />
          <CustomerInfo billInfo={modeledBillInfo} />
          {!isBillEmpty && <EmailInput appID={AppID.EDUCATION} themeColor={THEME_COLOR.IMA} />}
        </FormProvider>
        {!isBillEmpty && (
          <Policy
            policyUrl={POLICY_URL}
            themeColor={THEME_COLOR.IMA}
            policyTitle="Tôi đồng ý với Chính sách thanh toán phí của IMA"
            isChecked={policyChecked}
            iconExpand={iconExpand}
            onChange={onUpdatePolicyChecked}
          />
        )}
        {!isBillEmpty && (
          <SubmitButton
            themeColor={THEME_COLOR.IMA}
            isActive={policyChecked}
            text={'Thanh toán qua Zalopay'}
            onClick={handlePaymentClick}
          />
        )}
      </div>
    </div>
  )
}
