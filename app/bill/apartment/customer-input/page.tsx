'use client'

import billAPI from '@/api-client/bill'
import CaptchaInput from '@/app/bill/components/captcha-input'
import { DialogState } from '@/components/common/dialog'
import Input, { InputStatus } from '@/components/common/input'
import StaticImage from '@/components/common/static-image'
import { API_PATH, AppID, ProductID } from '@/constants/bill'
import useCustomSWR from '@/hooks/use-custom-swr'
import billModel from '@/models/bill'
import { useApartmentStore } from '@/store/bill'
import { IError } from '@/types/bill'
import { Captcha } from '@/types/common'
import { b64EncodeUnicode, cpsImageUrlWithPath } from '@/utils/bill'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import State, { mapStateViewByCodeAndReason, mapTitleByCodeAndReason } from '../../components/state'
import SubmitButton from '../../components/submit-button'
import SupplierHeader from '../../components/supplier-header'
import Loading from '../loading'

type FormValues = { customerCode: string; captchaCode: string }

export default function CustomerInput() {
  const router = useRouter()
  const updateBillInfo = useApartmentStore((state) => state.updateBillInfo)
  const updateSupplier = useApartmentStore((state) => state.updateSupplier)
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
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
  const {
    data,
    error,
    isLoading: areSuppliersLoading,
  } = useCustomSWR(API_PATH[AppID.APARTMENT].GET_SUPPLIERS, () =>
    billAPI.getSuppliers({ appID: AppID.APARTMENT })
  )
  const suppliers = billModel.modelSuppliers(data)
  const supplier = suppliers[0]

  if (areSuppliersLoading) {
    return <Loading />
  }

  if (error || billInfoError?.code) {
    const type = mapStateViewByCodeAndReason(
      billInfoError?.code || 200,
      billInfoError?.reason || ''
    )

    const handleButtonClick = () => {
      window.location.reload()
    }
    const customerCode = methods.getValues('customerCode')
    const deeplink = `https://onelink.zalopay.vn/chung-cu?view=detail&customercode=${customerCode}&supplierid=${supplier.ID}&appid=${AppID.APARTMENT}&act=open_cashier&from_source=webside_dgs`
    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.APARTMENT,
          deeplink,
          title:
            mapTitleByCodeAndReason(billInfoError?.code || 200, billInfoError?.reason || '') ||
            billInfoError?.message ||
            '',
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
            appID: AppID.APARTMENT,
            supplierID: supplier.ID,
            customerCode,
            captcha: captcha!,
            captchaCode,
          })
          updateBillInfo(response)
          updateSupplier(supplier)
          setIsLoading(false)
          let url = `/chung-cu/chi-tiet-hoa-don/${b64EncodeUnicode(data.customerCode)}?supplierid=${
            supplier.ID
          }`
          const encrypt = searchParams?.get('encrypt') || ''
          const voucherToken = searchParams?.get('voucherToken') || ''
          if (encrypt) {
            url += `&encrypt=${encrypt}`
          }
          if (voucherToken) {
            url += `&voucherToken=${voucherToken}`
          }
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

  return (
    <div>
      <SupplierHeader
        title="Nhập thông tin hoá đơn"
        supplier={supplier}
        alt="tra-cuu-thanh-toan-phi-chung-cu-online"
      />

      <FormProvider {...methods}>
        <CaptchaInput
          productID={ProductID.APARTMENT}
          appID={AppID.APARTMENT}
          captcha={captcha}
          onCaptchaChange={setCaptcha}
        >
          <Controller
            control={methods.control}
            name="customerCode"
            rules={{
              required: 'Bạn chưa nhập mã khách hàng',
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
          className="h-auto w-full md:h-96 md:w-auto"
          src={cpsImageUrlWithPath(`apartment/${supplier.icon ?? 'af_savista'}.png`)}
          width={0}
          height={0}
          loader={({ src }) => src}
          alt="tra-cuu-thanh-toan-phi-chung-cu-online"
        />
      </div>

      <SubmitButton text="Tiếp tục" onClick={handleBillInfoQuery} />
    </div>
  )
}
