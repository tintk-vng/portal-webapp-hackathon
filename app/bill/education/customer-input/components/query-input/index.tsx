import CaptchaInput from '@/app/bill/components/captcha-input'
import Input, { InputStatus } from '@/components/common/input'
import { AppID, ProductID, SupplierID } from '@/constants/bill'
import { QueryType } from '@/types/bill'
import { Captcha } from '@/types/common'
import { Controller, useFormContext } from 'react-hook-form'
import YOBSelectBottomSheet from '../../../components/yob-select-bottom-sheet'
import DepartmentSelect, { DepartmentType } from '../department-select'

interface QueryInputProps {
  selectedQueryType: QueryType
  captcha: Captcha | undefined
  onCaptchaChange: (captcha: Captcha | undefined) => void
}

export default function QueryInput({
  selectedQueryType,
  captcha,
  onCaptchaChange,
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
            required: `Bạn chưa ${label.toLowerCase() || 'nhập mã khách hàng'}`,
          }}
          render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
            <Input
              ref={ref}
              value={value}
              placeholder={label || 'Nhập mã khách hàng'}
              status={InputStatus.ERROR}
              message={error?.message as string}
              required
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

        {selectedQueryType.type === 3 && selectedSupplier.ID !== SupplierID.QUANG_ICH && (
          <>
            <div className="mt-3">
              {(() => {
                switch (selectedSupplier.ID) {
                  case SupplierID.JET_PAY:
                    return (
                      <Controller
                        control={control}
                        name="className"
                        rules={{
                          required: 'Bạn chưa nhập lớp học',
                        }}
                        render={({
                          field: { value, name, onChange, ref },
                          fieldState: { error },
                        }) => (
                          <Input
                            ref={ref}
                            value={value}
                            placeholder="Nhập lớp"
                            status={InputStatus.ERROR}
                            message={error?.message as string}
                            required
                            onChange={onChange}
                          />
                        )}
                      />
                    )
                  default:
                    return <YOBSelectBottomSheet />
                }
              })()}
            </div>

            <div className="mt-3">
              <DepartmentSelect type={DepartmentType.SCHOOL} />
            </div>
          </>
        )}
      </div>

      <CaptchaInput
        productID={ProductID.EDUCATION}
        appID={AppID.EDUCATION}
        captcha={captcha}
        onCaptchaChange={onCaptchaChange}
      />
    </div>
  )
}
