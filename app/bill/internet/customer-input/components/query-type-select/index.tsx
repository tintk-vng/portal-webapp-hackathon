import { Supplier, SupplierGroup } from '@/types/bill'
import classNames from 'classnames'

interface QueryTypeSelectProps {
  selectedSupplierGroup: SupplierGroup
  selectedSupplier: Supplier
  onSelectedSupplierChange: (selectedSupplier: Supplier) => void
}

export default function QueryTypeSelect({
  selectedSupplierGroup,
  selectedSupplier,
  onSelectedSupplierChange,
}: QueryTypeSelectProps) {
  const { suppliers } = selectedSupplierGroup

  return (
    <div className="mb-3 md:mb-4">
      <div className="mb-3 text-base font-bold text-dark-500 md:mb-4">Chọn loại phí thanh toán</div>

      <ul className="flex flex-row flex-nowrap items-center space-x-2">
        {suppliers?.map((supplier: Supplier) => {
          const isSelected = supplier.ID === selectedSupplier.ID

          return (
            <li
              key={supplier.ID}
              className={classNames({
                'flex h-10 w-1/2 shrink-0 cursor-pointer items-center justify-center rounded-full border px-2 py-3':
                  true,
                'border-blue-25 bg-blue-25': !isSelected,
                'border-blue-500 bg-white-500': isSelected,
              })}
              onClick={() => onSelectedSupplierChange(supplier)}
            >
              <label
                className={classNames({
                  'ml-2 cursor-pointer text-center text-label-lg': true,
                  'text-blue-500': isSelected,
                })}
              >
                {(supplier.queryTypes ?? [])[0]?.name ?? supplier.name}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
