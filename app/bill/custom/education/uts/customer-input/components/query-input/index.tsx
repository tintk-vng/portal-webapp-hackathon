import Input, { InputStatus } from '../../../components/input'
import { AppID, ProductID, SupplierID, THEME_COLOR } from '@/constants/bill'
import { QueryType } from '@/types/bill'
import { Captcha } from '@/types/common'
import { Controller, useFormContext } from 'react-hook-form'
import DepartmentSelect, { DepartmentType } from '../department-select'
import CaptchaInput from '../../../../../components/captcha-input'

interface QueryInputProps {
  selectedQueryType: QueryType
  captcha: Captcha | undefined
  onCaptchaChange: (captcha: Captcha | undefined) => void
  disable: boolean
}

export default function QueryInput({
  selectedQueryType,
  captcha,
  onCaptchaChange,
  disable = false,
}: QueryInputProps) {
  const { control, getValues, clearErrors } = useFormContext()
  const selectedSupplier = getValues('supplier')
  const label = selectedQueryType.args[0].label || ''

  return (
    <div>
      <div className="mb-3 md:mb-4">
        <div className="mb-3 text-base font-bold text-dark-500 md:mb-4">
          {selectedQueryType.name}
        </div>

        {selectedQueryType.type === 3 && selectedSupplier.ID === SupplierID.QUANG_ICH && (
          <DepartmentSelect type={DepartmentType.DEPARTMENT} />
        )}

        <Controller
          control={control}
          name="customerCode"
          rules={{
            required: `Bạn chưa nhập ${label.toLowerCase() || 'nhập mã khách hàng'}`,
          }}
          render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
            <Input
              ref={ref}
              disabled={disable}
              value={value}
              placeholder={'UTS10001'}
              status={InputStatus.ERROR}
              message={error?.message as string}
              required
              styleColor={THEME_COLOR.UTS}
              onChange={(e) => {
                let customerCode = e.toLocaleUpperCase()
                if (!customerCode) {
                  onChange('')
                  clearErrors(name)
                  return
                }
                onChange(customerCode)
              }}
            />
          )}
        />
      </div>

      <CaptchaInput
        styleColor={THEME_COLOR.UTS}
        themeColor={THEME_COLOR.UTS}
        productID={ProductID.EDUCATION}
        appID={AppID.EDUCATION}
        captcha={captcha}
        onCaptchaChange={onCaptchaChange}
      />
    </div>
  )
}
