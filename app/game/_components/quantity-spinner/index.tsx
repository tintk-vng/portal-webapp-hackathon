'use client'

import { AppID, EVENT, TelcoCode } from '@/constants/telco'
import { TrackingEvent } from '@/types/common'
import { DataPackage, DataSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

export default function QuantitySpinner() {
  const { control, getValues, setValue } = useFormContext()
  const selectedSupplier = useWatch({
    control,
    name: 'supplier',
  }) as DataSupplier
  const selectedPackage = useWatch({
    control,
    name: 'package',
  }) as DataPackage
  const isGooglePlay = selectedSupplier?.telcoCode === TelcoCode.GOOGLEPLAY

  useEffect(() => {
    setValue('quantity', 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSupplier?.telcoCode])

  useEffect(() => {
    const packageAmount = selectedPackage?.amount || 0
    setValue('amount', packageAmount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPackage?.ID])

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
    setValue('amount', packageAmount * quantity)
  }

  if (isGooglePlay) {
    return <span className="text-label-lg font-bold">1</span>
  }

  return (
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
              'h-6 w-6 min-w-6 bg-contain bg-no-repeat': true,
            })}
            onClick={() =>
              handleQuantityChange(value - 1, onChange, { ID: EVENT[AppID.GAME].DECREASE_QUANTITY })
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
              'h-6 w-6 min-w-6 bg-contain bg-no-repeat': true,
            })}
            onClick={() =>
              handleQuantityChange(value + 1, onChange, { ID: EVENT[AppID.GAME].INCREASE_QUANTITY })
            }
          />
        </div>
      )}
    />
  )
}
