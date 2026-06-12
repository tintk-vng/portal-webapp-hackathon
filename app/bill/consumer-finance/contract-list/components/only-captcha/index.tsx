'use client'

import commonAPI from '@/api-client/common'
import Image from '@/components/common/image'
import Input, { InputStatus } from '@/components/common/input'
import { AppID, ProductID } from '@/constants/bill'
import commonModel from '@/models/common'
import { Captcha } from '@/types/common'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { forwardRef, ReactElement, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styles from './styles.module.scss'
import StaticImage from '@/components/common/static-image'

const DEFAULT_CAPTCHA_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII='

interface OnlyCaptchaProps {
  children?: ReactElement
  productID: ProductID
  appID: AppID
  captcha: Captcha | undefined
  onCaptchaChange: (captcha: Captcha | undefined) => void
  noCaptcha?: boolean
}

const OnlyCaptcha = forwardRef<HTMLInputElement, OnlyCaptchaProps>(
  ({ children, productID, appID, captcha, onCaptchaChange, noCaptcha = false }, forwardedRef) => {
    const { control } = useFormContext()

    const generateCaptcha = async () => {
      try {
        const data = await commonAPI.generateCaptcha({ productID })
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
      cb('')
      generateCaptcha()
    }

    return (
      <div className="mb-3 w-full space-y-3 md:mb-4 lg:flex lg:space-x-3 lg:space-y-0">
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
              className={classNames({
                'w-full': true,
                'lg:w-1/2': !!children,
              })}
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
      </div>
    )
  }
)

OnlyCaptcha.displayName = 'OnlyCaptcha'

export default OnlyCaptcha
