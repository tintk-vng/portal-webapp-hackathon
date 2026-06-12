import { useEffect } from 'react'
import SeletBottomSheet from '@/app/bill/components/select-bottom-sheet'
import useScreen from '@/hooks/use-screen'
import useToggle from '@/hooks/use-toggle'
import { QueryType, Supplier } from '@/types/bill'
import { cpsImageUrlWithPath } from '@/utils/bill'
import { useFormContext } from 'react-hook-form'
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
  }, [suppliers, defaultSupplierID])

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

  return null
}
