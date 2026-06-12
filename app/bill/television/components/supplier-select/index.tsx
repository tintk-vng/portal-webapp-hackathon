import CheckBoxIcon from '@/app/bill/components/check-box'
import SeletBottomSheet from '@/app/bill/components/select-bottom-sheet'
import Image from '@/components/common/image'
import { SupplierGroup } from '@/types/bill/internet'
import { imageLoader } from '@/utils/bill'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import style from './style.module.scss'
import Suppliers from './suppliers'
import { useSearchParams } from 'next/navigation'

const maxShownRows = 4
const maxShownPerRow = 2
const maxButtonHeight = 60
const spacing = 12
const maxHeight = (maxButtonHeight + spacing) * maxShownRows + spacing

interface SupplierGroupsProps {
  supplierGroups: SupplierGroup[]
  isMobile?: boolean
}
export default function SupplierSelect({ supplierGroups, isMobile = false }: SupplierGroupsProps) {
  const { setValue, resetField, clearErrors } = useFormContext()
  const [isShownAll, setShownAll] = useState(false)
  const [selectedID, setSelectedID] = useState('')
  const searchParams = useSearchParams()
  const defaultSupplierID = Number(searchParams?.get('supplierid'))

  function handleSelectSupplierGroup(group: SupplierGroup, selectedSupplierID?: number) {
    if (selectedID === group.supplier_group_id) {
      return
    }
    setSelectedID(group.supplier_group_id)
    clearErrors()
    resetField('supplier')
    if (!isNaN(Number(selectedSupplierID))) {
      const supplier = group.suppliers.find(({ supplier_id }) => supplier_id === selectedSupplierID)
      if (supplier) {
        setValue('supplier', supplier)
        return
      }
    }
    // TODO: why 3?
    if (group.suppliers.length < 3) {
      setValue('supplier', group.suppliers[0])
    }
  }

  useEffect(() => {
    if (!Array.isArray(supplierGroups) || supplierGroups?.length === 0) {
      return
    }
    if (!isNaN(defaultSupplierID)) {
      const groupSupplierIndex = supplierGroups.findIndex(({ suppliers }) =>
        Boolean(suppliers.find(({ supplier_id }) => supplier_id === defaultSupplierID))
      )
      if (groupSupplierIndex !== -1) {
        handleSelectSupplierGroup(supplierGroups[groupSupplierIndex], defaultSupplierID)
      }
      if (groupSupplierIndex >= maxShownPerRow * maxShownRows) {
        setShownAll(true)
      }
    } else {
      handleSelectSupplierGroup(supplierGroups[0])
    }
  }, [supplierGroups, defaultSupplierID])

  if (!supplierGroups || supplierGroups.length <= 0) {
    return null
  }
  const maxHeightAll =
    (maxButtonHeight + spacing) * Math.ceil(supplierGroups.length / maxShownPerRow) + spacing

  function renderSupplierGroup(group: SupplierGroup) {
    const isSelected = group.supplier_group_id === selectedID
    return (
      <button
        type="button"
        key={group.supplier_group_id}
        className={classNames({
          'flex h-[62px] w-full items-center justify-center gap-x-3 rounded-lg border px-3 py-2.5 md:hover:border-blue-500 md:hover:bg-other-background [&>*]:pointer-events-none':
            true,
          'border-blue-500 bg-other-background': isSelected,
          'border-dark-50 bg-white-500': !isSelected,
        })}
        onClick={() => handleSelectSupplierGroup(group)}
      >
        {!!group.icon && (
          <Image src={group.icon} alt="group-logo" width={36} height={36} loader={imageLoader} />
        )}
        <p className=" line-clamp-2 text-left" style={{ width: 'calc(100% - 84px)' }}>
          {group.name}
        </p>
      </button>
    )
  }

  function renderSupplierGroups() {
    if (isMobile) {
      return (
        <>
          <div className="mt-3" />
          <SeletBottomSheet
            title="Chọn nhà cung cấp"
            optionDatas={supplierGroups.map(({ supplier_group_id, name, icon, ...others }) => ({
              ID: supplier_group_id,
              title: name,
              icon,
              passData: JSON.stringify(others),
            }))}
            selectedOptionID={selectedID}
            onOptionClick={({ ID, title, icon, passData = '' }) => {
              handleSelectSupplierGroup({
                supplier_group_id: ID,
                name: title,
                icon,
                ...JSON.parse(passData),
              })
            }}
          />
        </>
      )
    }
    return (
      <>
        <div
          className={classNames({
            'mt-3 grid w-full gap-3 overflow-hidden whitespace-normal py-3': true,
            [`grid-cols-${maxShownPerRow}`]: true,
          })}
          style={{
            transition: 'max-height 250ms ease',
            maxHeight: `${isShownAll ? maxHeightAll : maxHeight}px`,
          }}
        >
          {supplierGroups.map(renderSupplierGroup)}
        </div>
        {supplierGroups.length > maxShownRows * maxShownPerRow && (
          <div className="mt-3">
            <button
              type="button"
              className="mx-auto flex w-fit items-center gap-x-1 [&>*]:pointer-events-none"
              onClick={() => {
                setShownAll(!isShownAll)
              }}
            >
              <label className="w-[70px] text-right text-label-md font-bold text-blue-500">
                {isShownAll ? 'Thu gọn' : 'Xem thêm'}
              </label>
              <span
                className={classNames({
                  'h-[16px] w-[16px] bg-cover bg-center bg-no-repeat': true,
                  [style.arrowUpIcon]: true,
                  'rotate-180': !isShownAll,
                })}
              />
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="w-full">
        <p className="text-base font-bold">Nhà cung cấp</p>
        {renderSupplierGroups()}
      </div>
      <Suppliers
        key={selectedID}
        suppliers={
          supplierGroups.find(({ supplier_group_id }) => selectedID === supplier_group_id)
            ?.suppliers
        }
        isMobile={isMobile}
      />
    </>
  )
}
