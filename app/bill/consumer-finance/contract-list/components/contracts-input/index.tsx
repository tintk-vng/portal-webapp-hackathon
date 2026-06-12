'use client'
import { Controller, useFormContext } from 'react-hook-form'
import { IContract } from '@/types/bill/consumer-finance'
import Item from './Item'

const DEFAULT_CAPTCHA_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII='

interface ContractsInputProps {
  contracts?: IContract[]
  supplierName: string
  supplierLogo: string
}

export default function ContractsInput({
  contracts,
  supplierName,
  supplierLogo,
}: ContractsInputProps) {
  const { control, watch } = useFormContext()
  const selectedCustomerCode = watch('customerCode')

  return (
    <div className="mb-3 w-full space-y-3 md:mb-4 lg:flex lg:space-x-3 lg:space-y-0">
      <Controller
        control={control}
        name="customerCode"
        rules={{
          required: 'Bạn chưa chọn hợp đồng',
        }}
        render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
          <div className="w-full" style={{ maxHeight: '64vh', overflow: 'scroll' }}>
            {contracts?.map((contract: IContract, index: number) => {
              return (
                <div
                  onClick={() => {
                    onChange(contract.contract_number)
                  }}
                  className="mb-3"
                  key={index}
                >
                  <Item
                    {...contract}
                    company_name={supplierName}
                    iconUrl={supplierLogo}
                    selected={value === contract.contract_number}
                  />
                </div>
              )
            })}
            {error?.message && (
              <label className="mt-1 text-label-md text-red-500">{error?.message}</label>
            )}
          </div>
        )}
      />
    </div>
  )
}
