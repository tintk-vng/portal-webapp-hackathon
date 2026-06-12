'use client'

import EmailInput from '@/app/telco/_components/email-input'
import Input, { InputStatus } from '@/components/common/input'
import { AppID, EVENT, ProductID } from '@/constants/telco'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'
import { Controller, useFormContext } from 'react-hook-form'
import PayNowButton from '../pay-now-button'

const GotItVoucherInput = dynamic(() => import('@/components/common/gotit-voucher-input'))

enum AmountInputErrorMessage {
  EMPTY_AMOUNT = 'Bạn chưa nhập số tiền thanh toán',
  MIN_AMOUNT = 'Số tiền thanh toán tối thiểu là 5.000đ',
  MAX_AMOUNT = 'Số tiền thanh toán tối đa là 10.000.000đ',
}

export default function InputBillInvoiceInput() {
  const { control } = useFormContext()

  return (
    <div>
      <div className="mb-6 mt-3 space-y-4 md:flex md:space-x-4 md:space-y-0">
        <Controller
          control={control}
          name="amount"
          rules={{
            required: AmountInputErrorMessage.EMPTY_AMOUNT,
            validate: {
              // min: (value: string) =>
              //   Number(value) >= bill.minAmount ||
              //   `Số tiền thanh toán tối thiểu là ${commonUtil.formatCurrency(bill.minAmount)}`,
              // max: (value: string) =>
              //   Number(value) <= bill.maxAmount ||
              //   `Số tiền thanh toán tối đa là ${commonUtil.formatCurrency(bill.maxAmount)}`,
              min: (value: string) => {
                if (Number(value) < 5000) {
                  commonUtil.trackEvent({
                    ID: EVENT[AppID.POST_PAID].INPUT_AMOUNT,
                    metaData: {
                      amount: value,
                      error_message: AmountInputErrorMessage.MIN_AMOUNT,
                    },
                  })
                  return AmountInputErrorMessage.MIN_AMOUNT
                }
              },
              max: (value: string) => {
                if (Number(value) > 10000000) {
                  commonUtil.trackEvent({
                    ID: EVENT[AppID.POST_PAID].INPUT_AMOUNT,
                    metaData: {
                      amount: value,
                      error_message: AmountInputErrorMessage.MAX_AMOUNT,
                    },
                  })
                  return AmountInputErrorMessage.MAX_AMOUNT
                }
              },
            },
          }}
          render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
            <Input
              ref={ref}
              className="md:w-1/2"
              label="Số tiền cần thanh toán (*)"
              value={value}
              placeholder="Nhập số tiền"
              status={InputStatus.ERROR}
              message={error?.message}
              required
              onChange={(e) => {
                const whiteSpaceRegex = /\s+/g
                const digitRegex = /\D+/g
                const normalizedValue = e.replace(whiteSpaceRegex, '').replace(digitRegex, '')
                // const formattedValue = commonUtil.formatCurrency(Number(normalizedValue))
                commonUtil.trackEvent({
                  ID: EVENT[AppID.POST_PAID].INPUT_AMOUNT,
                  metaData: {
                    amount: normalizedValue,
                  },
                })
                onChange(normalizedValue)
                // const onlyNumberValue = e.replace(/[^0-9]/g, '')
                // const formattedValue = commonUtil.formatCurrency(Number(onlyNumberValue))
                // console.log('hihi', formattedValue)
                // setAmount(formattedValue)
              }}
              // onFocus={handlePaymentAmountFocus}
              // onBlur={handlePaymentAmountBlur}
            />
          )}
        />

        <div className="md:w-1/2">
          <EmailInput appID={AppID.POST_PAID} />
        </div>
      </div>

      <GotItVoucherInput productID={ProductID.POST_PAID} />

      <PayNowButton />
    </div>
  )
}
