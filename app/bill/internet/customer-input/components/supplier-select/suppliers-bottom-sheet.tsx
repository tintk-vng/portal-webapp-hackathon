import CheckBoxIcon from '@/app/bill/components/check-box'
import BottomSheet from '@/components/common/bottom-sheet'
import { Supplier } from '@/types/bill'

interface SuppliersBottomSheetProps {
  visible: boolean
  suppliers: Supplier[]
  selectedSupplier: Supplier
  onSupplierSelect: (supplier: Supplier) => void
  onClose: () => void
}
export default function SuppliersBottomSheet({
  visible,
  suppliers = [],
  selectedSupplier,
  onSupplierSelect = () => {},
  onClose,
}: SuppliersBottomSheetProps) {
  return (
    <>
      <BottomSheet title="Chọn khu vực" visible={visible} onClose={onClose}>
        <ul className="h-80 overflow-scroll">
          {suppliers.map((supplier) => {
            const { ID, name } = supplier
            const isSelected = ID === selectedSupplier?.ID

            return (
              <li
                key={ID}
                className="border-b border-dark-50 last:border-b-0"
                onClick={() => onSupplierSelect(supplier)}
              >
                <div className="flex h-[72px] items-center justify-between py-3">
                  <div className="flex flex-col items-start justify-center">
                    <label className="text-label-md">{name}</label>
                  </div>

                  <CheckBoxIcon isSelected={isSelected} />
                </div>
              </li>
            )
          })}
        </ul>
      </BottomSheet>
    </>
  )
}
