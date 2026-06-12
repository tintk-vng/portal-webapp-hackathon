'use client'
import Image from '@/components/common/image'
import { AppID, ProductID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import consumerFinanceModel from '@/models/bill/consumer-finance'
import { useConsumerFinanceStore } from '@/store/bill'
import { IContract } from '@/types/bill/consumer-finance'
import { b64EncodeUnicode, cpsImageUrlWithPath, imageLoader } from '@/utils/bill'
import commonUtil from '@/utils/common'
import { redirect, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import SubmitButton from '../../components/submit-button'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'
import { Captcha } from '@/types/common'
import { IError } from '@/types/bill'
import OnlyCaptcha from './components/only-captcha'
import { DialogState } from '@/components/common/dialog'
import billAPI from '@/api-client/bill'
import billModel from '@/models/bill'
import State, { mapStateViewByCodeAndReason, mapTitleByCodeAndReason } from '../../components/state'
import ContractsInput from './components/contracts-input'

const CONSUMER_FINANCE_HOME_PATH =
  MAPPED_PATH[Domain.BILL][AppID.CONSUMER_FINANCE]?.source || '/vay-tieu-dung'

const ContractList = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supplierID = parseInt(searchParams?.get('supplierid') || '0', 10)
  const supplierName = searchParams?.get('suppliername') || ''
  const icon = searchParams?.get('icon') || ''
  let imagePath = `logo/${icon}_v2.svg`
  const iconUrl = cpsImageUrlWithPath(imagePath)
  const methods = useForm<FormValues>({
    defaultValues: {
      customerCode: '',
      supplierID: supplierID,
      captchaCode: '',
    } as FormValues,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { setValue, setError, handleSubmit } = methods
  const [captcha, setCaptcha] = useState<Captcha | undefined>(undefined)
  const [billInfoError, setBillInfoError] = useState<IError | undefined>(undefined)
  const updateBillInfo = useConsumerFinanceStore((state) => state.updateBillInfo)
  const { contracts } = useConsumerFinanceStore()
  if (commonUtil.isEmpty(contracts)) {
    redirect(CONSUMER_FINANCE_HOME_PATH)
  }
  const modeledContracts = consumerFinanceModel.modelContracts(contracts)

  const onClose = () => {
    history.back()
  }

  const onContractClick = (contract: IContract) => {
    location.href = `/vay-tieu-dung/chi-tiet-hoa-don?supplierid=${supplierID}&customercode=${b64EncodeUnicode(
      contract.contract_number
    )}`
  }

  if (billInfoError?.code) {
    const type = mapStateViewByCodeAndReason(
      billInfoError?.code || 200,
      billInfoError?.reason || ''
    )

    const handleButtonClick = () => {
      window.location.reload()
    }

    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.CONSUMER_FINANCE,
          title: mapTitleByCodeAndReason(billInfoError?.code || 200, billInfoError?.reason || '') || billInfoError?.message || '',
          description: billInfoError?.description || '',
          onButtonClick: handleButtonClick,
        }}
      />
    )
  }

  const handleBillInfoQuery = (failureCallback: (state: DialogState) => void) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    handleSubmit(
      async (data) => {
        try {
          const { customerCode, captchaCode } = data
          const response = await billAPI.getBillInfo({
            appID: AppID.CONSUMER_FINANCE,
            supplierID,
            customerCode,
            captcha: captcha!,
            captchaCode,
          })
          updateBillInfo(response)
          router.push(
            `/vay-tieu-dung/chi-tiet-hoa-don/customercode=${b64EncodeUnicode(
              data.customerCode
            )}?supplierid=${supplierID}`
          )
        } catch (error: any) {
          console.log('Failed to query bill info: ', error)
          const errorCode = error.response?.data.error.code || error.code
          if (errorCode === 401) {
            setError('captchaCode', { message: 'Mã xác nhận không đúng' })
          } else if (isNaN(errorCode) || errorCode < 500) {
            failureCallback({
              visible: true,
              description:
                error.response?.data.error.detail.description ||
                error.response.data.error.message ||
                error?.message,
            })
          } else {
            const updatedError = billModel.modelError(error.response.data.error)
            setBillInfoError(updatedError)
          }
          setValue('captchaCode', '')
          setCaptcha(undefined)
          setIsLoading(false)
        }
      },
      (e) => {
        setIsLoading(false)
      }
    )()
  }

  return (
    <FormProvider {...methods}>
      <>
        <p className="mb-3 text-xl font-bold md:mb-6 md:text-2xl">Nhập thông tin hoá đơn</p>
        <div className="flex flex-col items-center gap-y-4 md:p-6 md:shadow-[0_2px_12px_0] md:shadow-dark-500/5 ">
          <div className="w-full">
            <p className="text-base font-bold">Chọn hợp đồng</p>
          </div>
          <ContractsInput
            contracts={modeledContracts}
            supplierName={supplierName}
            supplierLogo={iconUrl}
          />
          <OnlyCaptcha
            productID={ProductID.CONSUMER_FINANCE}
            appID={AppID.CONSUMER_FINANCE}
            captcha={captcha}
            onCaptchaChange={setCaptcha}
          />
          <SubmitButton className="w-full" text="Tiếp tục" onClick={handleBillInfoQuery} />
        </div>
      </>
    </FormProvider>
  )
}

interface FormValues {
  customerCode: string
  supplierID: number
  captchaCode: string
}

export default ContractList
