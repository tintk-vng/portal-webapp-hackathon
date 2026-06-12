'use client'

import postPaidAPI from '@/api-client/telco/post-paid'
import CaptchaInput from '@/app/telco/_components/captcha-input'
import Button, { ButtonSize, ButtonType } from '@/components/common/button'
import Input, { InputStatus } from '@/components/common/input'
import { AppID, EVENT, SupplierStatus, TelcoCode } from '@/constants/telco'
import postPaidModel from '@/models/telco/post-paid'
import { PostPaidSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'
import { forwardRef, MutableRefObject, useContext, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { PostPaidContext } from '../main'
import SupplierSelect from '../supplier-select'

const CustomerInput = forwardRef<HTMLInputElement>(({}, forwardedRef) => {
  const {
    control,
    formState: { defaultValues },
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    reset,
  } = useFormContext()
  const {
    suppliers,
    billInfoState,
    selectedSupplier,
    captcha,
    onBillInfoStateChange,
    onSupplierChange,
    onCaptchaChange,
  } = useContext(PostPaidContext)
  const captchaInputRef = useRef<HTMLInputElement | null>(null)

  const handleQueryBillClick = handleSubmit(async (data) => {
    try {
      commonUtil.trackEvent({ ID: EVENT[AppID.POST_PAID].CLICK_QUERY_BILL_BUTTON })
      onBillInfoStateChange({
        billInfo: undefined,
        isLoading: true,
        error: undefined,
      })
      const matchedSupplier = suppliers.find(
        (supplier) => supplier.telcoCode === selectedSupplier.telcoCode
      )
      const response = await postPaidAPI.getBillInfo({
        supplierID: matchedSupplier?.ID!,
        customerCode: data.phoneNumber,
        captcha: captcha!,
        captchaCode: data.captchaCode,
      })
      const newBillInfo = postPaidModel.modelBillInfo(response)
      onBillInfoStateChange({
        billInfo: newBillInfo,
        isLoading: false,
        error: undefined,
      })
    } catch (error: any) {
      console.log('Failed to query bill info: ', error)
      const errorStatus = error.response.status
      if (errorStatus === 401) {
        setError('captchaCode', { message: 'Mã xác nhận không đúng' })
      } else if (errorStatus === 429) {
        setError('phoneNumber', {
          message: 'Nhập sai thông tin khách hàng quá số lần quy định. Vui lòng thử lại sau',
        })
      } else if (errorStatus === 404) {
        setError('phoneNumber', { message: 'Mã khách hàng không đúng' })
      }
      setValue('captchaCode', '')
      onCaptchaChange(undefined)
      onBillInfoStateChange({
        billInfo: undefined,
        isLoading: false,
        error,
      })
    }
  })

  const handleClear = () => {
    reset()
    onCaptchaChange(undefined)
  }

  return (
    <div className="mb-9 lg:flex lg:space-x-3">
      <Controller
        control={control}
        name="phoneNumber"
        rules={{
          required: 'Bạn chưa nhập số điện thoại',
          validate: (value: string) => {
            const telcoCode = telcoUtil.getTelcoCodeFromPhoneNumber(value)
            if (telcoCode === TelcoCode.INVALID || value.length !== 10) {
              commonUtil.trackEvent({
                ID: EVENT[AppID.POST_PAID].INPUT_PHONE_NUMBER,
                metaData: {
                  phone_number: value,
                  error_message: 'Số điện thoại chưa hợp lệ',
                },
              })
              onSupplierChange({} as PostPaidSupplier)
              return 'Số điện thoại chưa hợp lệ'
            }
            return undefined
          },
        }}
        render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
          <Input
            ref={(e) => {
              ref(e)
              if (forwardedRef != null && typeof forwardedRef !== 'function') {
                forwardedRef.current = e
              }
            }}
            className="w-full lg:w-2/5"
            type="tel"
            label="Số điện thoại cần thanh toán (*)"
            value={value}
            placeholder="Nhập số điện thoại"
            status={InputStatus.ERROR}
            message={error?.message as string}
            required
            autoFocus
            onChange={(e) => {
              if (billInfoState.billInfo) {
                onCaptchaChange(undefined)
                onBillInfoStateChange({
                  billInfo: undefined,
                  isLoading: false,
                  error: undefined,
                })
              }
              clearErrors()
              const formattedPhoneNumber = telcoUtil.formatPhoneNumber(e)
              commonUtil.trackEvent({
                ID: EVENT[AppID.POST_PAID].INPUT_PHONE_NUMBER,
                metaData: {
                  phone_number: formattedPhoneNumber,
                },
              })
              onChange(formattedPhoneNumber)
              if (formattedPhoneNumber.length >= 10) {
                const telcoCode = telcoUtil.getTelcoCodeFromPhoneNumber(formattedPhoneNumber)
                if (telcoCode === TelcoCode.INVALID) {
                  commonUtil.trackEvent({
                    ID: EVENT[AppID.POST_PAID].INPUT_PHONE_NUMBER,
                    metaData: {
                      phone_number: formattedPhoneNumber,
                      error_message: 'Số điện thoại chưa hợp lệ',
                    },
                  })
                  setError(name, { message: 'Số điện thoại chưa hợp lệ' })
                  defaultValues && onSupplierChange({} as PostPaidSupplier)
                } else {
                  const matchedSupplier = suppliers.find(
                    (supplier) => supplier.telcoCode === telcoCode
                  )
                  const unsupportedSupplier = {
                    ID: 0,
                    telcoCode,
                    status: SupplierStatus.UNSUPPORTED,
                  }
                  const supplier = matchedSupplier || unsupportedSupplier
                  onSupplierChange(supplier)
                  const customerInputRef = forwardedRef as MutableRefObject<HTMLInputElement>
                  customerInputRef.current?.blur()
                  captchaInputRef.current?.focus()
                }
              }
            }}
            onClear={handleClear}
            addOn={<SupplierSelect />}
          />
        )}
      />

      <div className="mt-4 w-full lg:mt-0 lg:w-2/5">
        <CaptchaInput
          appID={AppID.POST_PAID}
          ref={captchaInputRef}
          captcha={captcha}
          onCaptchaChange={onCaptchaChange}
        />
      </div>

      <div className="mt-4 h-[52px] w-full lg:mt-10 lg:w-1/5">
        <Button
          width="w-full"
          height="h-full"
          type={ButtonType.SECONDARY}
          size={ButtonSize.LARGE}
          bold={false}
          onClick={handleQueryBillClick}
        >
          Tra cứu cước
        </Button>
      </div>
    </div>
  )
})

CustomerInput.displayName = 'CustomerInput'

export default CustomerInput
