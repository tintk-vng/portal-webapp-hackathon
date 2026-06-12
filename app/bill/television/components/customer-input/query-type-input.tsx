import Input, { InputStatus } from '@/components/common/input'
import { Controller, useFormContext } from 'react-hook-form'

export default function QueryTypeInput({
  name,
  label = '',
  formatter = (value: string) => value,
}: {
  name: string
  label?: string
  formatter?: (value: string) => string
}) {
  const { control } = useFormContext()

  if (!name) {
    return null
  }

  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={{
          required: `Bạn chưa nhập ${label.toLocaleLowerCase()}`,
        }}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <Input
            ref={ref}
            type="text"
            value={value}
            placeholder={label}
            status={error?.message ? InputStatus.ERROR : InputStatus.DEFAULT}
            message={error?.message}
            required
            onChange={onChange}
            formatter={formatter}
          />
        )}
        shouldUnregister
      />
    </>
  )
}
