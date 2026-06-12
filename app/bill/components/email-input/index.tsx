import Input, { InputStatus } from '@/components/common/input'
import { AppID } from '@/constants/bill'
import { EMAIL_REGEX } from '@/constants/common'
import commonUtil from '@/utils/common'
import { Controller, useFormContext } from 'react-hook-form'

enum EmailInputErrorMessage {
  EMPTY_EMAIL = 'Bạn chưa nhập email để nhận thông tin',
  INVALID_EMAIL = 'Email chưa đúng định dạng',
}

interface EmailInputProps {
  appID?: AppID
}

export default function EmailInput({ appID }: EmailInputProps) {
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
            status={InputStatus.ERROR}
            message={error?.message}
            required
            onChange={(e) => {
              const formattedValue = commonUtil.removeAccents(e)
              // commonUtil.trackEvent({
              //   ID: EVENT[appID].INPUT_EMAIL,
              //   metaData: {
              //     email: formattedValue,
              //   },
              // })
              onChange(formattedValue)
            }}
          />
        )}
      />

      <div className="mt-2 flex items-start space-x-3 rounded-lg bg-blue-50 px-4 py-2.5 md:mt-4">
        <span className="h-6 w-6 min-w-[24px] cursor-pointer bg-[url('../public/images/icons/bell.svg')] bg-contain bg-no-repeat" />

        <label className="label-lg text-dark-400">
          Kết quả giao dịch sẽ được gửi tới địa chỉ email của bạn nhập. Vui lòng xác nhận những
          thông tin cung cấp là hoàn toàn chính xác
        </label>
      </div>
    </div>
  )
}
