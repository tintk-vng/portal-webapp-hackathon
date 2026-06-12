import Input, { InputStatus } from '../input'
import { AppID, THEME_COLOR } from '@/constants/bill'
import { EMAIL_REGEX } from '@/constants/common'
import commonUtil from '@/utils/common'
import { Controller, useFormContext } from 'react-hook-form'

enum EmailInputErrorMessage {
  EMPTY_EMAIL = 'Bạn chưa nhập email để nhận thông tin',
  INVALID_EMAIL = 'Email chưa đúng định dạng',
}

interface EmailInputProps {
  appID?: AppID
  themeColor?: string
}

export default function EmailInput({ appID, themeColor = THEME_COLOR.UTS }: EmailInputProps) {
  const { control } = useFormContext()

  return (
    <div className="md:mb-4">
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
              // commonUtil.trackEvent({
              //   ID: EVENT[appID].INPUT_EMAIL,
              //   metaData: {
              //     email: value,
              //     error_message: EmailInputErrorMessage.INVALID_EMAIL,
              //   },
              // })
              return EmailInputErrorMessage.INVALID_EMAIL
            }
          },
        }}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <Input
            ref={ref}
            type="email"
            label="Địa chỉ email (*)"
            value={value}
            placeholder="Vui lòng nhập email"
            styleColor={themeColor}
            status={InputStatus.ERROR}
            message={error?.message}
            required
            onChange={(e) => {
              const formattedValue = commonUtil.removeAccents(e)
              onChange(formattedValue)
            }}
          />
        )}
      />
    </div>
  )
}
