import Image from '@/components/common/image'
import { IContract } from '@/types/bill/consumer-finance'
import { imageLoader } from '@/utils/bill'
import classNames from 'classnames'

export default function Item({
  contract_number,
  due_date,
  company_name,
  iconUrl = '',
  selected,
}: ItemProps) {
  console.log('selected', selected)
  return (
    <div
      className={classNames({
        'rounded-lg border p-3': true,
        'border-dark-50': !selected,
        'border-blue-500': selected,
      })}
    >
      <div className="flex items-center">
        <Image src={iconUrl} alt="" width={36} height={36} loader={imageLoader} />
        <label className="ml-3 text-sm">{company_name}</label>
      </div>
      <div className="mt-6 flex justify-between">
        <label className="text-sm text-dark-300">Mã hợp đồng</label>
        <label className="text-sm font-bold text-dark-500">{contract_number}</label>
      </div>
      {due_date && (
        <>
          <div className="my-3 h-[1px] bg-dark-50" />
          <div className="flex justify-between">
            <label className="text-sm text-dark-300">Hạn thanh toán</label>
            <label className="text-sm text-dark-500">{due_date}</label>
          </div>
        </>
      )}
    </div>
  )
}

interface ItemProps extends IContract {
  iconUrl: string
  selected?: boolean
}
