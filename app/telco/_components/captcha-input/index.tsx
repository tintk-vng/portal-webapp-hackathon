'use client'

import commonAPI from '@/api-client/common'
import Image from '@/components/common/image'
import Input, { InputStatus } from '@/components/common/input'
import StaticImage from '@/components/common/static-image'
import { AppID, EVENT, ProductID } from '@/constants/telco'
import commonModel from '@/models/common'
import { Captcha } from '@/types/common'
import commonUtil from '@/utils/common'
import { forwardRef, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const DEFAULT_CAPTCHA_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII='

interface CaptchaInputProps {
  appID: AppID
  captcha: Captcha | undefined
  onCaptchaChange: (captcha: Captcha | undefined) => void
}

const CaptchaInput = forwardRef<HTMLInputElement, CaptchaInputProps>(
  ({ appID, captcha, onCaptchaChange }, forwardedRef) => {
    const { control } = useFormContext()

    const generateCaptcha = async () => {
      try {
        const data = await commonAPI.generateCaptcha({ productID: ProductID.POST_PAID })
        const newCaptcha = commonModel.modelCaptcha(data)
        onCaptchaChange(newCaptcha)
      } catch (error) {
        console.log('Failed to generate captcha: ', error)
        onCaptchaChange(undefined)
      }
    }

    useEffect(() => {
      if (!captcha) {
        generateCaptcha()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [captcha])

    const handleReset = (cb: (...event: any[]) => void) => {
      commonUtil.trackEvent({ ID: EVENT[appID].RESET_CAPTCHA })
      cb('')
      generateCaptcha()
      // setTimeout(() => {
      //   setError('captchaCode', { message: 'Vui lòng nhập lại mã xác nhận' })
      // }, 500)
    }

    return (
      <Controller
        control={control}
        name="captchaCode"
        rules={{
          required: 'Bạn chưa nhập mã xác nhận',
        }}
        render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
          <Input
            ref={(e) => {
              ref(e)
              if (forwardedRef != null && typeof forwardedRef !== 'function') {
                forwardedRef.current = e
              }
            }}
            className="w-full"
            label="Mã xác nhận"
            value={value}
            placeholder="Nhập mã"
            status={InputStatus.ERROR}
            message={error?.message as string}
            required
            maxLength={6}
            onChange={(e) => {
              const formattedValue = commonUtil.removeAccents(e)
              if (formattedValue.length > 6) {
                return
              }
              commonUtil.trackEvent({
                ID: EVENT[appID].INPUT_CAPTCHA,
                metaData: { captcha: formattedValue },
              })
              onChange(formattedValue)
            }}
            addOn={
              <div className="flex h-full items-center justify-between">
                <div className="relative h-full w-24">
                  <Image src={captcha?.image || DEFAULT_CAPTCHA_IMAGE} fill alt="captcha-image" />
                </div>

                <div
                  className="b-l-dark-100 flex h-full cursor-pointer items-center border-l px-4"
                  onClick={() => handleReset(onChange)}
                >
                  <StaticImage
                    src="https://scdn.zalopay.com.vn/zst/zpi/images/design-system/icons/Second/general_reset.svg"
                    width={24}
                    height={24}
                    alt="reset-icon"
                  />
                </div>
              </div>
            }
          />
        )}
      />
    )
  }
)

CaptchaInput.displayName = 'CaptchaInput'

export default CaptchaInput
