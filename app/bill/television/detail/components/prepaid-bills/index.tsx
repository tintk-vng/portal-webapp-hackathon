import CheckBoxIcon from '@/app/bill/components/check-box'
import { IBill, IBillInfo } from '@/types/bill'
import commonUtil from '@/utils/common'
import { Controller, useFormContext } from 'react-hook-form'

function Warning({ supplierID }: { supplierID: number }) {
  // 272: Viettel Telecom, Mua gói trả trước
  if (supplierID === 373) {
    return (
      <div className="flex w-full items-center rounded-lg bg-orange-50 px-4 py-2.5">
        <span className="mr-2 h-6 w-6 min-w-[24px] bg-[url('../public/images/icons/general_warning.svg')] bg-contain bg-no-repeat" />

        <p className="text-label-md" style={{ maxWidth: 'calc(100% - 32px)' }}>
          Viettel chưa hỗ trợ hoàn, huỷ thanh toán
        </p>
      </div>
    )
  }
  return null
}

function Package({ bill, isSelected = false }: { bill: IBill; isSelected: boolean }) {
  const { amount, package_name, description = '' } = bill
  let _gifts: string[] = ['', '']
  if (description) {
    _gifts = description.split('\n')
  }
  return (
    <div className="relative w-full rounded-lg bg-other-background px-4 py-3">
      <div className="absolute right-2 top-2">
        <CheckBoxIcon isSelected={isSelected} />
      </div>
      <div className="flex w-full flex-col gap-y-2.5">
        {!!package_name && <p className="text-label-lg">{package_name}</p>}
        <p className="text-label-lg font-bold">{commonUtil.formatCurrency(amount)}</p>
        {!!description && (
          <p className="flex items-center justify-center">
            <span className="mr-1 h-4 w-4 min-w-[16px] bg-[url('../public/images/icons/gift.svg')] bg-contain bg-no-repeat" />

            <div className="text-left">
              {_gifts[0] !== '' && (
                <div>
                  <span className="text-label-md text-dark-300">{_gifts[0]}</span>
                </div>
              )}
              {_gifts[1] !== '' && (
                <div>
                  <span className="text-label-md text-dark-300">{_gifts[1]}</span>
                </div>
              )}
            </div>
          </p>
        )}
      </div>
    </div>
  )
}

export default function PrepaidBills({ billInfo }: { billInfo: IBillInfo }) {
  const { control } = useFormContext()

  if (billInfo?.bills?.length < 1) {
    return null
  }

  function handleSelectPackage(bill: IBill, cb: (...event: any[]) => void) {
    cb([bill])
  }

  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-base font-bold">Chọn gói trả trước</p>
      <Warning supplierID={billInfo.supplierID} />
      <Controller
        control={control}
        name="bills"
        render={({ field: { onChange, value } }) => (
          <div className="grid grid-cols-2 gap-4">
            {billInfo.bills.map((bill) => (
              <button
                key={bill.bill_id}
                onClick={() => handleSelectPackage(bill, onChange)}
                className="[&>*]:pointer-events-none"
              >
                <Package
                  bill={bill}
                  isSelected={value.length > 0 ? bill.bill_id === value[0].bill_id : false}
                />
              </button>
            ))}
          </div>
        )}
      />
    </div>
  )
}
