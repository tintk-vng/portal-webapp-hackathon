import SeletBottomSheet from '@/app/bill/components/select-bottom-sheet'
import Button, { ButtonType } from '@/components/common/button'
import Image from '@/components/common/image'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import useToggle from '@/hooks/use-toggle'
import { SupplierGroup } from '@/types/bill'
import { cpsImageUrlWithPath } from '@/utils/bill'
import classNames from 'classnames'
import styles from './styles.module.scss'
import { useEffect } from 'react'

interface SupplierGroupSelectProps {
  supplierGroups: SupplierGroup[]
  selectedSupplierGroup: SupplierGroup
  onSelectedGroupChange: (supplierGroup: SupplierGroup) => void
}

export default function SupplierGroupSelect({
  supplierGroups,
  selectedSupplierGroup,
  onSelectedGroupChange,
}: SupplierGroupSelectProps) {
  const { size } = useScreen()
  const [isExpanded, toggle] = useToggle()
  useEffect(() => {
    if (selectedSupplierGroup) {
      const index = supplierGroups.findIndex(
        (supplierGroup: SupplierGroup) => supplierGroup.ID === selectedSupplierGroup.ID
      )
      if (index >= 9 && !isExpanded) {
        toggle()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierGroups, selectedSupplierGroup])
  const MobileSelect = () => (
    <div className="mt-3">
      <SeletBottomSheet
        title="Chọn nhà cung cấp"
        optionDatas={supplierGroups.map(({ ID, name, icon, ...others }) => ({
          ID,
          title: name,
          icon: cpsImageUrlWithPath(`logo/${icon}.png`),
          passData: JSON.stringify(others),
        }))}
        selectedOptionID={selectedSupplierGroup?.ID}
        onOptionClick={({ ID, title, icon, passData = '' }) => {
          onSelectedGroupChange({ ID, name: title, icon, ...JSON.parse(passData) })
        }}
      />
    </div>
  )

  const DesktopSelect = () => {
    const visibleSupplierGroups =
      isExpanded || supplierGroups.length <= 9 ? supplierGroups : supplierGroups.slice(0, 9)
    return (
      <>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {visibleSupplierGroups.map((supplierGroup) => {
            const isSelected = supplierGroup.ID === selectedSupplierGroup?.ID

            return (
              <button
                key={supplierGroup.ID}
                className={classNames({
                  'flex h-[62px] w-full items-center justify-start gap-x-3 rounded-lg border px-3 py-2.5 md:hover:border-blue-500 md:hover:bg-other-background [&>*]:pointer-events-none':
                    true,
                  'border-blue-500 bg-other-background': isSelected,
                  'border-dark-50 bg-white-500': !isSelected,
                })}
                onClick={() => onSelectedGroupChange(supplierGroup)}
              >
                <Image
                  className="min-w-[36px]"
                  src={cpsImageUrlWithPath(`logo/${supplierGroup.icon}.png`)}
                  width={36}
                  height={36}
                  alt="supplier-logo"
                  loader={({ src }) => src}
                />

                <label
                  className={classNames({
                    'text-left text-label-md': true,
                    'text-blue-500': isSelected,
                  })}
                >
                  {supplierGroup.name}
                </label>
              </button>
            )
          })}
        </div>

        {supplierGroups.length > 9 && (
          <div className="mt-6">
            <Button width="w-full" type={ButtonType.TEXT_LINK} onClick={toggle}>
              <div className="flex items-center space-x-2">
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}

                <span
                  className={classNames({
                    [styles.arrowUpIcon]: true,
                    'rotate-180': !isExpanded,
                  })}
                />
              </div>
            </Button>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="mb-3 md:mb-4">
      <div className="text-base font-bold text-dark-500">Nhà cung cấp</div>

      {size === ScreenSize.SMALL ? <MobileSelect /> : <DesktopSelect />}
    </div>
  )
}
