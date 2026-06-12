import useScreen, { ScreenSize } from '@/hooks/use-screen'
import useToggle from '@/hooks/use-toggle'
import { Supplier, SupplierGroup } from '@/types/bill'
import SelectComponent from '../select-component'
import SupplierBottomSheet from './suppliers-bottom-sheet'
import SupplierDropdown from './suppliers-dropdown'

interface SupplierSelectProps {
  selectedSupplierGroup: SupplierGroup
  selectedSupplier: Supplier
  onSelectedSupplierChange: (selectedSupplier: Supplier) => void
}

export default function SupplierSelect({
  selectedSupplierGroup,
  selectedSupplier,
  onSelectedSupplierChange,
}: SupplierSelectProps) {
  const { size } = useScreen()
  const [visible, toggle] = useToggle()
  const { suppliers } = selectedSupplierGroup

  const handleSupplierSelect = (supplier: Supplier) => {
    onSelectedSupplierChange(supplier)
    toggle()
    // const errorMessage = errors[FIELD_NAME]?.message
    // if (errorMessage) {
    //   clearErrors(FIELD_NAME)
    // }
  }

  return (
    <div className="relative mb-3 w-full md:mb-4">
      <div className="mb-3 text-base font-bold text-dark-500 md:mb-4">Khu vực</div>

      <SelectComponent
        value={selectedSupplier.name}
        placeholder="Chọn khu vực"
        icon={'https://scdn.zalopay.com.vn/zst/zpi/images/bill/portal/icons/general_down.svg'}
        onClick={toggle}
      />

      {size === ScreenSize.SMALL ? (
        <SupplierBottomSheet
          visible={visible}
          suppliers={suppliers}
          selectedSupplier={selectedSupplier}
          onSupplierSelect={handleSupplierSelect}
          onClose={toggle}
        />
      ) : (
        <SupplierDropdown
          visible={visible}
          suppliers={suppliers}
          selectedSupplier={selectedSupplier}
          onSupplierSelect={handleSupplierSelect}
          onClose={toggle}
        />
      )}
    </div>
  )
}
