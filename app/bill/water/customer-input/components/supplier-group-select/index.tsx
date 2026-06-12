import SeletBottomSheet from '@/app/bill/components/select-bottom-sheet'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import { SupplierGroup } from '@/types/bill/water'
import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'

interface SupplierGroupSelectProps {
  supplierGroups: SupplierGroup[]
  onSupplierGroupSelect: (selectedSupplierGroup: SupplierGroup) => void
  currentSupplierGroup: SupplierGroup
}

export default function SupplierGroupSelect({
  supplierGroups,
  onSupplierGroupSelect,
  currentSupplierGroup,
}: SupplierGroupSelectProps) {
  const { size } = useScreen()
  const { setValue } = useFormContext()

  const handleSupplierGroupSelect = (selectedSupplierGroup: SupplierGroup) => {
    if (selectedSupplierGroup.ID === currentSupplierGroup.ID) {
      return
    }
    const supplierGroup = supplierGroups.find(
      (supplierGroup) => supplierGroup.ID === selectedSupplierGroup.ID
    )
    if (supplierGroup) {
      onSupplierGroupSelect(supplierGroup)
      supplierGroup.suppliers.length === 1 && setValue('supplier', supplierGroup.suppliers[0])
    }
  }

  const MobileSelect = () => (
    <SeletBottomSheet
      title="Chọn khu vực"
      optionDatas={supplierGroups.map(({ ID, name, ...others }) => ({
        ID,
        title: name,
        passData: JSON.stringify(others),
      }))}
      onOptionClick={({ ID, title, passData = '' }) => {
        handleSupplierGroupSelect({ ID, name: title, ...JSON.parse(passData) })
      }}
      selectedOptionID={currentSupplierGroup.ID}
    />
  )

  const DesktopSelect = () => (
    <ul className="no-scrollbar relative flex flex-row flex-nowrap items-center space-x-2 overflow-x-scroll scroll-smooth">
      {supplierGroups.map((supplierGroup) => {
        const isSelected = supplierGroup.ID === currentSupplierGroup.ID

        return (
          <li
            key={supplierGroup.ID}
            className={classNames({
              'relative flex h-10 shrink-0 cursor-pointer items-center rounded-full border px-2 py-3 transition-colors duration-500':
                true,
              'border-other-background bg-other-background': !isSelected,
              'border-blue-500 bg-white-500': isSelected,
            })}
            onClick={() => handleSupplierGroupSelect(supplierGroup)}
          >
            {supplierGroup.name}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="mb-3 md:mb-4">
      <div className="mb-3 text-base font-bold text-dark-500 md:mb-4">Nhà cung cấp</div>

      {size === ScreenSize.SMALL ? <MobileSelect /> : <DesktopSelect />}
    </div>
  )
}
