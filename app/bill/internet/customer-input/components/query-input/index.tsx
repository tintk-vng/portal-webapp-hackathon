import CaptchaInput from '@/app/bill/components/captcha-input'
import Input, { InputStatus } from '@/components/common/input'
import { AppID, ProductID } from '@/constants/bill'
import { Supplier } from '@/types/bill'
import { Captcha } from '@/types/common'
import telcoUtil from '@/utils/telco'
import { Controller, useFormContext } from 'react-hook-form'

interface QueryInputProps {
  selectedSupplier: Supplier
  captcha: Captcha | undefined
  onCaptchaChange: (captcha: Captcha | undefined) => void
}

export default function QueryInput({
  selectedSupplier,
  captcha,
  onCaptchaChange,
}: QueryInputProps) {
  const { control, getValues, clearErrors } = useFormContext()
  const formatter: { [key: string]: (v: string) => string } = {
    phoneNumber: (value: string) => telcoUtil.formatPhoneNumber(value),
  }
  const inputType: { [key: string]: string } = {
    phoneNumber: 'tel',
  }
  const { queryTypes = [{ args: [{ name: 'customerCode', label: 'Nhập mã khách hàng' }] }] } =
    selectedSupplier || {}
  const { args } = queryTypes?.[0]

  return (
    <div>
      <div className="mb-3 md:mb-4">
        <div className="mb-3 text-base font-bold text-dark-500 md:mb-4">
          {args.length > 1 ? 'Thông tin khách hàng' : 'Mã khách hàng'}
        </div>

        {args.map(({ name, label }) => (
          <Controller
            key={name}
            control={control}
            name={name}
            rules={{
              required: `Bạn chưa ${label.toLowerCase() || 'nhập mã khách hàng'}`,
            }}
            render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
              <Input
                ref={ref}
                className="mt-3 first:mt-0"
                value={value}
                placeholder={label || 'Nhập mã khách hàng'}
                status={InputStatus.ERROR}
                message={error?.message as string}
                required
                onChange={(e) => {
                  let formattedValue = e.toLocaleLowerCase()
                  if (!formattedValue) {
                    onChange('')
                    clearErrors(name)
                    return
                  }
                  onChange(formattedValue)
                }}
                formatter={formatter[name]}
                type={inputType[name]}
              />
            )}
          />
        ))}
      </div>

      <CaptchaInput
        productID={ProductID.INTERNET}
        appID={AppID.INTERNET}
        captcha={captcha}
        onCaptchaChange={onCaptchaChange}
      />
    </div>
  )
}
