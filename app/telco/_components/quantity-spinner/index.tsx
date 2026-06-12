'use client'

import { AppID, EVENT } from '@/constants/telco'
import { TrackingEvent } from '@/types/common'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { Controller, useFormContext } from 'react-hook-form'

interface QuantitySpinnerProps {
  appID: AppID
  onAmountChange: (amount: number) => void
}

export default function QuantitySpinner({ appID, onAmountChange }: QuantitySpinnerProps) {
  const { control, getValues } = useFormContext()

  const handleQuantityChange = (
    quantity: number,
    cb: (...event: any[]) => void,
    event: TrackingEvent
  ) => {
    if (quantity < 1 || quantity > 5) {
      return
    }
    commonUtil.trackEvent(event)
    cb(quantity)
    const phoneCardPackage = getValues('package')
    const packageAmount = phoneCardPackage?.amount || 0
    onAmountChange(packageAmount * quantity)
  }

  return (
    <div className="mb-6 flex h-14 items-center justify-between rounded-lg bg-other-background px-4 py-3">
      <div className="text-heading-sm">Số lượng</div>

      <Controller
        control={control}
        name="quantity"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value, ref } }) => (
          <div ref={ref} className="flex items-center space-x-2">
            <span
              className={classNames({
                'cursor-pointer bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/primary_minus.svg")]':
                  value > 1,
                'bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/minus.svg")]':
                  value <= 1,
                'h-8 w-8 min-w-8 bg-contain bg-no-repeat': true,
              })}
              onClick={() =>
                handleQuantityChange(value - 1, onChange, {
                  ID: EVENT[AppID.GAME].DECREASE_QUANTITY,
                })
              }
            />

            <span className="flex w-6 items-center justify-center text-label-lg font-bold">
              {value}
            </span>

            <span
              className={classNames({
                'cursor-pointer bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/primary_plus.svg")]':
                  value < 5,
                'bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/plus.svg")]':
                  value >= 5,
                'h-8 w-8 min-w-8 bg-contain bg-no-repeat': true,
              })}
              onClick={() =>
                handleQuantityChange(value + 1, onChange, {
                  ID: EVENT[AppID.GAME].INCREASE_QUANTITY,
                })
              }
            />
          </div>
        )}
      />
    </div>
  )
}
