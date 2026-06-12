import { useEffect } from 'react'
import SeletBottomSheet from '@/app/bill/components/select-bottom-sheet'
import Button, { ButtonType } from '@/components/common/button'
import Image from '@/components/common/image'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import useToggle from '@/hooks/use-toggle'
import { QueryType, Supplier } from '@/types/bill'
import { cpsImageUrlWithPath } from '@/utils/bill'
import classNames from 'classnames'
import { Controller, useFormContext } from 'react-hook-form'
import styles from './styles.module.scss'
import { useSearchParams } from 'next/navigation'

interface SelectProps {
  selectedSupplier: Supplier | undefined
  errorMessage: any
  onSupplierSelect: (supplier: Supplier) => void
}

interface SupplierSelectProps {
  suppliers: Supplier[]
  onSelectedQueryTypeChange: (selectedQueryType: QueryType) => void
  onSetDefault: (supplier: Supplier) => void
}

export default function SupplierSelect({
  suppliers,
  onSelectedQueryTypeChange,
  onSetDefault,
}: SupplierSelectProps) {
  const { size } = useScreen()
  const { control, resetField, clearErrors } = useFormContext()
  const [isExpanded, toggle] = useToggle()
  const searchParams = useSearchParams()
  const defaultSupplierID = Number(searchParams?.get('supplierid') || undefined)
  useEffect(() => {
    if (!Array.isArray(suppliers) || !suppliers.length) {
      return
    }
    if (!isNaN(defaultSupplierID)) {
      const defaultSupplier = suppliers.find(
        (supplier) => Number(supplier.ID) === defaultSupplierID
      )
      if (defaultSupplier) {
        onSetDefault(defaultSupplier)
        const defaultQueryType = defaultSupplier.queryTypes?.[0]
        defaultQueryType && onSelectedQueryTypeChange(defaultQueryType)
      }
    } else {
      onSetDefault(suppliers[0])
      const defaultQueryType = suppliers[0].queryTypes?.[0]
      defaultQueryType && onSelectedQueryTypeChange(defaultQueryType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSupplierID])

  const MobileSelect = ({ selectedSupplier, errorMessage, onSupplierSelect }: SelectProps) => (
    <div className="mt-3">
      <SeletBottomSheet
        title="Chọn nhà cung cấp"
        optionDatas={suppliers.map(({ ID, name, icon, ...others }) => ({
          ID,
          title: name,
          icon: cpsImageUrlWithPath(`logo/${icon}.png`),
          passData: JSON.stringify(others),
        }))}
        selectedOptionID={selectedSupplier?.ID}
        onOptionClick={({ ID, title, icon, passData = '' }) => {
          onSupplierSelect({ ID, name: title, icon, ...JSON.parse(passData) })
        }}
      />

      {errorMessage && <div className="mt-0.5 text-label-md text-red-500">{errorMessage}</div>}
    </div>
  )

  const DesktopSelect = ({ selectedSupplier, errorMessage, onSupplierSelect }: SelectProps) => {
    const visibleSuppliers = isExpanded || suppliers.length <= 9 ? suppliers : suppliers.slice(0, 9)
    useEffect(() => {
      if (selectedSupplier) {
        const index = suppliers.findIndex((supplier) => supplier.ID === selectedSupplier.ID)
        if (index >= 9 && !isExpanded) {
          toggle()
        }
      }
    }, [visibleSuppliers, selectedSupplier])
    return (
      <>
        {errorMessage && <div className="mt-0.5 text-label-md text-red-500">{errorMessage}</div>}

        <div className="mt-4 grid grid-cols-3 gap-3">
          {visibleSuppliers.map((supplier: Supplier) => {
            const isSelected = supplier.ID === selectedSupplier?.ID

            return (
              <button
                key={supplier.ID}
                className={classNames({
                  'flex h-[62px] w-full items-center justify-start gap-x-3 rounded-lg border px-3 py-2.5 md:hover:border-blue-500 md:hover:bg-other-background [&>*]:pointer-events-none':
                    true,
                  'border-blue-500 bg-other-background': isSelected,
                  'border-dark-50 bg-white-500': !isSelected,
                })}
                onClick={() => onSupplierSelect(supplier)}
              >
                <Image
                  className="min-w-[36px]"
                  src={cpsImageUrlWithPath(`logo/${supplier.icon}.png`)}
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
                  {supplier.name}
                </label>
              </button>
            )
          })}
        </div>

        {suppliers.length > 9 && (
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

      <Controller
        control={control}
        name="supplier"
        rules={{
          required: 'Bạn chưa chọn nhà cung cấp',
        }}
        render={({ field: { value, name, onChange }, fieldState: { error } }) => {
          const handleChange = (supplier: Supplier) => {
            resetField(name)
            clearErrors()
            onChange(supplier)
            if (Number(supplier.ID) !== 0) {
              const defaultQueryType = supplier.queryTypes?.[0]
              defaultQueryType && onSelectedQueryTypeChange(defaultQueryType)
            }
          }

          return (
            <>
              {size === ScreenSize.SMALL ? (
                <MobileSelect
                  selectedSupplier={value}
                  errorMessage={error?.message}
                  onSupplierSelect={handleChange}
                />
              ) : (
                <DesktopSelect
                  selectedSupplier={value}
                  errorMessage={error?.message}
                  onSupplierSelect={handleChange}
                />
              )}
            </>
          )
        }}
      />
    </div>
  )
}
