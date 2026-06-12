import { Supplier } from '@/types/bill/internet'
import telcoUtil from '@/utils/telco'
import { useFormContext } from 'react-hook-form'
import QueryTypeInput from './query-type-input'

export default function CustomerInput() {
  const { getValues } = useFormContext()
  const supplier: Supplier = getValues('supplier')
  const formatter: { [key: string]: (v: string) => string } = {
    customerCode: (value: string) => value,
    phone: (value: string) => telcoUtil.formatPhoneNumber(value),
  }
  const { query_types = [{ args: [{ name: 'customerCode', label: 'Mã khách hàng' }] }] } = supplier
  const args = query_types[0].args
  return (
    <>
      <div className="mb-3 mt-3 flex w-full flex-col gap-y-3">
        <p className="text-base font-bold">
          {args.length > 1 ? 'Thông tin khách hàng' : 'Mã khách hàng'}
        </p>
        {args.map(({ name, label }) => (
          <QueryTypeInput key={name} name={name} label={label} formatter={formatter[name]} />
        ))}
      </div>
    </>
  )
}
