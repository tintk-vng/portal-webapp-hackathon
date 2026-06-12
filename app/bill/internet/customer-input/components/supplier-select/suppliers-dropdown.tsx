import CheckBoxIcon from '@/app/bill/components/check-box'
import useOutsideClick from '@/hooks/use-outside-click'
import { Supplier } from '@/types/bill'
import { useRef } from 'react'

interface SupplierDropdownProps {
  visible: boolean
  suppliers: Supplier[]
  selectedSupplier: Supplier
  onClose: () => void
  onSupplierSelect: (supplier: Supplier) => void
}

export default function SupplierDropdown({
  visible,
  suppliers = [],
  selectedSupplier,
  onClose,
  onSupplierSelect,
}: SupplierDropdownProps) {
  const SupplierDropdownRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(SupplierDropdownRef, onClose)

  if (!visible) {
    return null
  }

  return (
    <div
      ref={SupplierDropdownRef}
      className="absolute z-[100] mt-2 w-full bg-white-500 p-4 py-4 md:rounded-lg md:shadow-[0_2px_12px_0] md:shadow-dark-500/5"
    >
      <ul className="h-80 overflow-scroll">
        {suppliers.map((supplier: Supplier) => {
          const { ID, name } = supplier
          const isSelected = ID === selectedSupplier?.ID

          return (
            <li
              key={ID}
              className="border-b border-dark-50 last:border-b-0"
              onClick={() => onSupplierSelect(supplier)}
            >
              <div className="flex h-[62px] items-center justify-between py-3">
                <div className="flex flex-col items-start justify-center">
                  <label className="text-label-md">{name}</label>
                </div>

                <CheckBoxIcon isSelected={isSelected} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
