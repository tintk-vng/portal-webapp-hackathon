import DropdownList from '@/app/bill/components/dropdown-list'
import SeletBottomSheet from '@/app/bill/components/select-bottom-sheet'
import { Supplier } from '@/types/bill/internet'
import classNames from 'classnames'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

const FIELD_NAME = 'supplier'

interface SuppliersProps {
  suppliers?: Supplier[]
  isMobile?: boolean
}
export default function Suppliers({ suppliers = [], isMobile = false }: SuppliersProps) {
  const {
    register,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()
  const selectedSupplier = getValues(FIELD_NAME) ?? { supplier_id: 0 }
  const [selectedSupplierID, setSelectedSupplierID] = useState(selectedSupplier.supplier_id)
  const errorMessage = errors[FIELD_NAME]?.message as string

  if (!suppliers || suppliers.length < 2) {
    return null
  }

  function handleSelectSupplier(supplier: Supplier) {
    if (selectedSupplierID === supplier.supplier_id) {
      return
    }
    setSelectedSupplierID(supplier.supplier_id)
    clearErrors(FIELD_NAME)
    setValue(FIELD_NAME, supplier)
  }

  if (suppliers.length > 2) {
    // view dropdown
    return (
      <>
        <input
          {...register(FIELD_NAME, {
            validate: {
              required: (value) => value.supplier_id !== 0 || 'Bạn chưa chọn khu vực',
            },
          })}
          style={{ display: 'none' }}
        />
        <div className="w-full">
          <p className="mb-3 text-base font-bold">Khu vực</p>
          {isMobile ? (
            <SeletBottomSheet
              title="Chọn khu vực"
              optionDatas={suppliers.map(({ supplier_id, name, ...others }) => ({
                ID: `${supplier_id}`,
                title: name,
                passData: JSON.stringify(others),
              }))}
              selectedOptionID={`${selectedSupplierID}`}
              onOptionClick={({ ID, title, passData = '' }) => {
                handleSelectSupplier({
                  supplier_id: parseInt(ID, 10),
                  name: title,
                  ...JSON.parse(passData),
                })
              }}
            />
          ) : (
            <DropdownList
              title="Chọn khu vực"
              optionDatas={suppliers.map(({ supplier_id, name, ...others }) => ({
                ID: `${supplier_id}`,
                title: name,
                passData: JSON.stringify(others),
              }))}
              selectedOptionID={`${selectedSupplierID}`}
              onOptionClick={({ ID, title, passData = '' }) => {
                handleSelectSupplier({
                  supplier_id: parseInt(ID, 10),
                  name: title,
                  ...JSON.parse(passData),
                })
              }}
            />
          )}
          {errorMessage && (
            <label className="mt-1 text-label-md text-red-500">{errorMessage}</label>
          )}
        </div>
      </>
    )
  }

  // view 2 opts checkbox
  return (
    <>
      <input
        {...register(FIELD_NAME, {
          validate: {
            required: (value) => value.supplier_id !== 0 || 'Bạn chưa chọn loại phí thanh toán',
          },
        })}
        style={{ display: 'none' }}
      />
      <div className="w-full">
        <p className="mb-3 text-base font-bold">Chọn loại phí thanh toán</p>
        <div className="flex gap-x-3">
          {suppliers.map((supplier) => {
            const isSelected = supplier.supplier_id === selectedSupplierID
            const name = (supplier.query_types ?? [])[0]?.name ?? supplier.name
            return (
              <button
                type="button"
                key={supplier.supplier_id}
                className={classNames({
                  'w-full rounded-full px-3 py-2.5 text-label-lg ring-1 ring-inset transition-[box-shadow]':
                    true,
                  'bg-white-500 text-blue-500 ring-blue-500': isSelected,
                  'bg-blue-25 ring-blue-25': !isSelected,
                })}
                onClick={() => handleSelectSupplier(supplier)}
              >
                {name}
              </button>
            )
          })}
        </div>
        {errorMessage && <label className="mt-1 text-label-md text-red-500">{errorMessage}</label>}
      </div>
    </>
  )
}
