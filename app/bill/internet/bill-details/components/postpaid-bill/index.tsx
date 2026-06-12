import Input, { InputStatus } from '@/components/common/input'
import { IBillInfo } from '@/types/bill'
import commonUtil from '@/utils/common'
import { Controller, useFormContext } from 'react-hook-form'

function Warning({ supplierID }: { supplierID: number }) {
  // 208: Viettel Telecom, Gói cước trả sau
  if (supplierID === 208) {
    return (
      <div className="flex w-full rounded-lg bg-orange-25 px-4 py-2.5">
        <span className="mr-2 h-6 w-6 min-w-[24px] bg-[url('../public/images/icons/general_warning.svg')] bg-contain bg-no-repeat" />

        <div className="text-label-md" style={{ maxWidth: 'calc(100% - 32px)' }}>
          <p className="mb-2 font-bold">Lưu ý:</p>
          <ul className="space-y-2">
            <li className="relative pl-3 before:absolute before:left-0 before:top-2 before:flex before:h-[3px] before:w-[3px] before:rounded-full before:bg-dark-500 before:content-['']">
              Viettel chưa hỗ trợ hoàn, huỷ thanh toán.
            </li>
            <li className="relative pl-3 before:absolute before:left-0 before:top-2 before:flex before:h-[3px] before:w-[3px] before:rounded-full before:bg-dark-500 before:content-['']">
              Thanh toán đủ hoá đơn để không gián đoạn dịch vụ. Nếu đóng thừa, bạn sẽ được khấu trừ
              vào kỳ hoá đơn sau.
            </li>
          </ul>
        </div>
      </div>
    )
  }
  return null
}

export default function PostpaidBill({ billInfo }: { billInfo: IBillInfo }) {
  const { control } = useFormContext()

  if (billInfo?.bills?.length < 1) {
    return null
  }

  const bill = billInfo.bills[0]

  let title
  if (bill.month_string) {
    title = `Kỳ thanh toán tháng ${bill.month_string}`
  } else if (bill.description) {
    title = bill.description
  }

  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-base font-bold">{title}</p>
      <Warning supplierID={billInfo.supplierID} />
      <Controller
        control={control}
        name="amount"
        rules={{
          required: 'Bạn chưa nhập số tiền cần thanh toán',
          validate: {
            min: (value) =>
              parseInt(commonUtil.formatNumber(value), 10) >= 50000 ||
              'Số tiền thanh toán tối thiểu 50.000đ',
          },
        }}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <Input
            type="tel"
            ref={ref}
            value={value}
            placeholder="Nhập số tiền cần thanh toán"
            status={InputStatus.ERROR}
            message={error?.message}
            required
            onChange={(e) => {
              if (e) {
                const numberStringValue = commonUtil.formatNumber(e).slice(0, 8)
                const normalizedValue = commonUtil
                  .formatCurrency(parseInt(numberStringValue, 10))
                  .slice(0, -1)
                onChange(normalizedValue)
              } else {
                onChange('')
              }
            }}
            onFocus={() => {
              if (value) {
                const normalizedValue = value.replace(/[^\d\.]/g, '')
                onChange(normalizedValue)
              }
            }}
            onBlur={() => {
              if (value && value !== '0') {
                const currencyValue = value + 'đ'
                onChange(currencyValue)
              }
            }}
          />
        )}
        shouldUnregister
      />
    </div>
  )
}
