'use client'

import Input, { InputStatus } from '@/components/common/input'
import {
  AppID,
  EVENT,
  SupplierStatus,
  SUPPLIER_ORDER_BY_TELCO_CODE,
  TelcoCode,
} from '@/constants/telco'
import { DataSupplier, DataPackage, PostPaidSupplier, TopupSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'
import { ReactElement, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const MAX_PHONE_NUMBER_DIGITS = 10
enum PhoneNumberInputErrorMessage {
  EMPTY_PHONE_NUMBER = 'Bạn chưa nhập số điện thoại',
  INVALID_PHONE_NUMBER = 'Số điện thoại chưa hợp lệ',
}

interface PhoneNumberInputProps {
  appID: AppID
  defaultSupplier: TopupSupplier | DataSupplier | PostPaidSupplier
  suppliers: Array<TopupSupplier | DataSupplier | PostPaidSupplier>
  onSupplierChange: Function
  children: ReactElement
}

export default function PhoneNumberInput({
  appID,
  defaultSupplier,
  suppliers,
  onSupplierChange,
  children,
}: PhoneNumberInputProps) {
  const { control, setFocus, setError, clearErrors, reset } = useFormContext()
  const phoneNumberInputRef = useRef<HTMLInputElement | null>(null)

  const handleClear = () => {
    reset()
    onSupplierChange(defaultSupplier)
  }

  return (
    <div className="mb-6">
      <Controller
        control={control}
        name="phoneNumber"
        rules={{
          required: PhoneNumberInputErrorMessage.EMPTY_PHONE_NUMBER,
          validate: (value: string) => {
            const telcoCode = telcoUtil.getTelcoCodeFromPhoneNumber(value)
            if (telcoCode === TelcoCode.INVALID || value.length !== MAX_PHONE_NUMBER_DIGITS) {
              commonUtil.trackEvent({
                ID: EVENT[appID].INPUT_PHONE_NUMBER,
                metaData: {
                  phone_number: value,
                  error_message: PhoneNumberInputErrorMessage.INVALID_PHONE_NUMBER,
                },
              })
              onSupplierChange(defaultSupplier)
              return PhoneNumberInputErrorMessage.INVALID_PHONE_NUMBER
            }
            return undefined
          },
        }}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <Input
            ref={(e) => {
              ref(e)
              if (phoneNumberInputRef != null && typeof phoneNumberInputRef !== 'function') {
                phoneNumberInputRef.current = e
              }
            }}
            className="w-full"
            type="tel"
            label="Số điện thoại cần thanh toán (*)"
            value={value}
            placeholder="Nhập số điện thoại"
            status={InputStatus.ERROR}
            message={error?.message as string}
            required
            autoFocus={!value}
            onChange={(e) => {
              if (error) {
                clearErrors()
              }
              const formattedPhoneNumber = telcoUtil.formatPhoneNumber(e)
              commonUtil.trackEvent({
                ID: EVENT[appID].INPUT_PHONE_NUMBER,
                metaData: {
                  phone_number: formattedPhoneNumber,
                },
              })
              onChange(formattedPhoneNumber)
              if (formattedPhoneNumber.length >= MAX_PHONE_NUMBER_DIGITS) {
                const telcoCode = telcoUtil.getTelcoCodeFromPhoneNumber(formattedPhoneNumber)
                if (telcoCode === TelcoCode.INVALID) {
                  commonUtil.trackEvent({
                    ID: EVENT[appID].INPUT_PHONE_NUMBER,
                    metaData: {
                      phone_number: formattedPhoneNumber,
                      error_message: PhoneNumberInputErrorMessage.INVALID_PHONE_NUMBER,
                    },
                  })
                  setError('phoneNumber', {
                    message: PhoneNumberInputErrorMessage.INVALID_PHONE_NUMBER,
                  })
                } else {
                  const matchedSupplier = suppliers.find(
                    (supplier) => supplier.telcoCode === telcoCode
                  )
                  const unsupportedSupplier = {
                    telcoCode,
                    status: SupplierStatus.UNSUPPORTED,
                    order: SUPPLIER_ORDER_BY_TELCO_CODE[telcoCode],
                    packages: [] as DataPackage[],
                  }
                  const updatedSelectedSupplier = matchedSupplier || unsupportedSupplier
                  onSupplierChange(updatedSelectedSupplier)
                  phoneNumberInputRef?.current?.blur()
                  setFocus('package')
                }
              }
            }}
            onClear={handleClear}
            addOn={children}
          />
        )}
      />
    </div>
  )
}
