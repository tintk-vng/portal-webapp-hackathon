'use client'

import CaptchaInput from '@/app/bill/components/captcha-input'
import { DialogState } from '@/components/common/dialog'
import Input, { InputStatus } from '@/components/common/input'
import StaticImage from '@/components/common/static-image'
import { AppID, ProductID } from '@/constants/bill'
import billModel from '@/models/bill'
import { IError, Supplier } from '@/types/bill'
import { Captcha } from '@/types/common'
import { cpsImageUrlWithPath } from '@/utils/bill'
import { createContext, ReactElement, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import State, { mapStateViewByCodeAndReason, mapTitleByCodeAndReason } from '../state'
import SubmitButton from '../submit-button'
import SupplierHeader from '../supplier-header'

type FormValues = { customerCode: string; captchaCode: string }

interface Context { }

interface CommonBusinessWrapperProps {
  children: ReactElement
  defaultFormValues: { [key: string]: any }
  onSubmit: () => void
}

export const WrapperContext = createContext({} as Context)

export default function CommonBusinessWrapper({
  children,
  defaultFormValues,
  onSubmit,
}: CommonBusinessWrapperProps) {
  // const router = useRouter()
  // const updateBillInfo = useElectricStore((state) => state.updateBillInfo)
  const methods = useForm<FormValues>({
    defaultValues: {
      customerCode: '',
      captchaCode: '',
      ...defaultFormValues,
    },
  })
  const { setError, clearErrors, handleSubmit } = methods
  const [isLoading, setIsLoading] = useState(false)
  const [captcha, setCaptcha] = useState<Captcha | undefined>(undefined)
  const [billInfoError, setBillInfoError] = useState<IError | undefined>(undefined)

  const handleBillInfoQuery = (failureCallback: (state: DialogState) => void) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    handleSubmit(
      async (data) => {
        try {
          onSubmit()
          // const { customerCode, captchaCode } = data
          // const response = await billAPI.getBillInfo({
          //   appID: AppID.ELECTRIC,
          //   customerCode,
          //   captcha: captcha!,
          //   captchaCode,
          // })
          // updateBillInfo(response)
          // router.push(`/dien/chi-tiet-hoa-don/${b64EncodeUnicode(customerCode)}`)
          setIsLoading(false)
        } catch (error: any) {
          console.log('Failed to query bill info: ', error)
          const errorCode = error.response?.data.error.code || error.code
          if (errorCode === 401) {
            setError('captchaCode', { message: 'Mã xác nhận không đúng' })
          } else if (isNaN(errorCode) || errorCode < 500) {
            failureCallback({
              visible: true,
              title: error.response?.data.error.message,
              description: error.response?.data.error.detail.description || error?.message,
            })
          } else {
            const updatedError = billModel.modelError(error.response.data.error)
            setBillInfoError(updatedError)
          }
          methods.setValue('captchaCode', '')
          setCaptcha(undefined)
          setIsLoading(false)
        }
      },
      (e) => {
        setIsLoading(false)
      }
    )()
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
          appID: AppID.ELECTRIC,
          title: mapTitleByCodeAndReason(billInfoError?.code || 200, billInfoError?.reason || '') || billInfoError?.message || '',
          description: billInfoError.description || '',
          onButtonClick: handleButtonClick,
        }}
      />
    )
  }

  return (
    <div>
      <SupplierHeader
        title="Nhập thông tin hoá đơn"
        supplier={{ name: 'Tập đoàn điện lực Việt Nam', icon: 'EVN' } as Supplier}
        alt="tra-cuu-tien-dien-online"
      />

      <WrapperContext.Provider
        value={
          {
            // suppliers,
            // billInfoState,
            // selectedSupplier,
            // captcha,
            // onBillInfoStateChange: setBillInfoState,
            // onSupplierChange: setSelectedSupplier,
            // onCaptchaChange: setCaptcha,
          }
        }
      >
        <FormProvider {...methods}>{children}</FormProvider>
      </WrapperContext.Provider>

      <CaptchaInput
        productID={ProductID.ELECTRIC}
        appID={AppID.ELECTRIC}
        captcha={captcha}
        onCaptchaChange={setCaptcha}
      >
        <Controller
          control={methods.control}
          name="customerCode"
          rules={{
            required: 'Bạn chưa nhập mã khách hàng',
            // validate: (value: string) => {},
          }}
          render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
            <Input
              ref={ref}
              value={value}
              label="Mã khách hàng"
              placeholder="Nhập mã khách hàng"
              status={InputStatus.ERROR}
              message={error?.message as string}
              required
              autoFocus
              onChange={(e) => {
                let customerCode = e.toLocaleUpperCase()
                if (!customerCode) {
                  onChange('')
                  clearErrors(name)
                  return
                }
                const validPrefixes = [
                  'PC',
                  'PP',
                  'PQ',
                  'PA',
                  'PH',
                  'PM',
                  'PN',
                  'PB',
                  'PK',
                  'PE',
                  'PD',
                  'PT',
                ]
                const customerPrefix = customerCode.substring(0, 2)
                const isValid = validPrefixes.includes(customerPrefix)
                if (!isValid) {
                  setError(name, { message: 'Mã khách hàng không chính xác' })
                } else if (isValid && error?.message) {
                  clearErrors(name)
                }
                onChange(customerCode)
              }}
            />
          )}
        />
      </CaptchaInput>

      <div className="mt-4 text-label-lg text-dark-300">Hoá đơn mẫu</div>

      <div className="mt-3 flex max-h-full max-w-full items-center justify-center">
        <StaticImage
          src={cpsImageUrlWithPath(`electric/dien_evn.png`)}
          alt="tra-cuu-tien-dien-online"
          className="h-auto w-full md:h-96 md:w-auto"
          width={0}
          height={0}
          loader={({ src }) => src}
        />
      </div>

      <SubmitButton text="Tiếp tục" onClick={handleBillInfoQuery} />
    </div>
  )
}
