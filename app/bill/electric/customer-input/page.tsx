'use client'

import billAPI from '@/api-client/bill'
import CaptchaInput from '@/app/bill/components/captcha-input'
import { DialogState } from '@/components/common/dialog'
import Input, { InputStatus } from '@/components/common/input'
import StaticImage from '@/components/common/static-image'
import { AppID, ProductID } from '@/constants/bill'
import billModel from '@/models/bill'
import { useElectricStore } from '@/store/bill'
import { IError, Supplier } from '@/types/bill'
import { Captcha } from '@/types/common'
import { b64EncodeUnicode, cpsImageUrlWithPath } from '@/utils/bill'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import State, { mapStateViewByCodeAndReason, mapTitleByCodeAndReason } from '../../components/state'
import SubmitButton from '../../components/submit-button'
import SupplierHeader from '../../components/supplier-header'

type FormValues = { customerCode: string; captchaCode: string }

export default function CustomerInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  const updateBillInfo = useElectricStore((state) => state.updateBillInfo)
  const methods = useForm<FormValues>({
    defaultValues: {
      customerCode: '',
      captchaCode: '',
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
          const { customerCode, captchaCode } = data
          const response = await billAPI.getBillInfo({
            appID: AppID.ELECTRIC,
            customerCode,
            captcha: captcha!,
            captchaCode,
          })
          updateBillInfo(response)
          setIsLoading(false)
          const encrypt = searchParams?.get('encrypt') || ''
          const voucherToken = searchParams?.get('voucherToken') || ''
          let url = `/dien/chi-tiet-hoa-don?customercode=${b64EncodeUnicode(
            customerCode
          )}&encrypt=${encrypt}&voucherToken=${voucherToken}`
          if (utmSource) {
            url += `&utm=${utmSource}`
          }
          router.push(url)
        } catch (error: any) {
          console.log('Failed to query bill info: ', error)
          const errorCode = error.response?.data.error.code || error.code
          if (errorCode === 401) {
            setError('captchaCode', { message: 'Mã xác nhận không đúng' })
          } else if (isNaN(errorCode) || errorCode < 500) {
            failureCallback({
              visible: true,
              title: error.response?.data.error.message,
              description:
                error.response?.data.error.detail.description ||
                error.response.data.error.message ||
                error?.message,
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
    const customerCode = methods.getValues('customerCode')
    const deeplink = `https://onelink.zalopay.vn/dien?view=detail&customercode=${customerCode}&appid=${AppID.ELECTRIC}&act=open_cashier&from_source=webside_dgs`
    const handleButtonClick = () => {
      window.location.reload()
    }

    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.ELECTRIC,
          title:
            mapTitleByCodeAndReason(billInfoError?.code || 200, billInfoError?.reason || '') ||
            billInfoError?.message ||
            '',
          deeplink,
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

      <FormProvider {...methods}>
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
      </FormProvider>

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
