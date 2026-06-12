import Input, { InputStatus } from '@/components/common/input'
import { EMAIL_REGEX } from '@/constants/common'
import { AppID, EVENT } from '@/constants/telco'
import commonUtil from '@/utils/common'
import { MutableRefObject } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

enum EmailInputErrorMessage {
  EMPTY_EMAIL = 'Bạn chưa nhập email để nhận thông tin',
  INVALID_EMAIL = 'Email chưa đúng định dạng',
}

interface EmailInputProps {
  innerRef: MutableRefObject<HTMLInputElement | null>
}

export default function EmailInput({ innerRef }: EmailInputProps) {
  const { control } = useFormContext()

  return (
    <div className="mb-6 mt-3">
      <div className="mb-3 text-heading-md md:mb-4 md:text-heading-lg">Email nhận mã thẻ</div>

      <Controller
        control={control}
        name="email"
        rules={{
          required: EmailInputErrorMessage.EMPTY_EMAIL,
          // pattern: {
          //   value: EMAIL_REGEX,
          //   message: 'Email chưa đúng định dạng',
          // },
          validate: (value) => {
            if (!EMAIL_REGEX.test(value)) {
              commonUtil.trackEvent({
                ID: EVENT[AppID.GAME].INPUT_EMAIL,
                metaData: {
                  email: value,
                  error_message: EmailInputErrorMessage.INVALID_EMAIL,
                },
              })
              return EmailInputErrorMessage.INVALID_EMAIL
            }
          },
        }}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <Input
            ref={(e) => {
              ref(e)
              if (innerRef != null && typeof innerRef !== 'function') {
                innerRef.current = e
              }
            }}
            type="email"
            value={value}
            placeholder="Vui lòng nhập email nhận mã thẻ"
            status={error?.message ? InputStatus.ERROR : InputStatus.DEFAULT}
            message={error?.message}
            required
            onChange={(e) => {
              const formattedValue = commonUtil.removeAccents(e)
              commonUtil.trackEvent({
                ID: EVENT[AppID.GAME].INPUT_EMAIL,
                metaData: {
                  email: formattedValue,
                },
              })
              onChange(formattedValue)
            }}
          />
        )}
      />
    </div>
  )
}
