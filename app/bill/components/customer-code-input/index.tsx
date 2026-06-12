'use client'
import Input, { InputStatus } from '@/components/common/input'
import { Controller, useFormContext } from 'react-hook-form'

export default function CustomerCodeInput({
  className = '',
  formatter,
}: {
  className?: string
  formatter?: (v: string) => string
}) {
  const { control } = useFormContext()

  return (
    <div className={className}>
      <Controller
        control={control}
        name="customerCode"
        rules={{
          required: 'Bạn chưa nhập mã khách hàng',
        }}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <Input
            ref={ref}
            type="text"
            value={value}
            placeholder="Nhập mã khách hàng"
            status={error?.message ? InputStatus.ERROR : InputStatus.DEFAULT}
            message={error?.message}
            required
            onChange={onChange}
            formatter={formatter}
          />
        )}
      />
    </div>
  )
}
