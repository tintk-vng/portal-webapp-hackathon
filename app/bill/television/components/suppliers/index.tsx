import Image from '@/components/common/image'
import { Supplier as SupplierData } from '@/types/bill/water'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import CheckBoxIcon from '../check-box'
import SeletBottomSheet from '../select-bottom-sheet'
import { cpsImageUrlWithPath, imageLoader } from '@/utils/bill'
import { Supplier } from '@/types/bill/television'
import { SupplierIds } from '../../const'

const ArrowUp = '/images/icons/primary_arrow_up_ic16.svg'
const maxShownRows = 3
const maxButtonHeight = 62
const spacing = 12
const maxHeight = (maxButtonHeight + spacing) * maxShownRows + spacing
const FIELD_NAME = 'supplier'
const FIELD_NAME_CUSTOMER_CODE = 'customerCode'
interface SuppliersProps {
  supplierDatas: Supplier[]
  selectedSupplierID?: string
  isMobile?: boolean
}
export default function Suppliers({ supplierDatas, isMobile = false }: SuppliersProps) {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>({} as Supplier)
  const [isShownAll, setShownAll] = useState(false)
  const maxHeightAll = (maxButtonHeight + spacing) * Math.ceil(supplierDatas.length / 3) + spacing
  const errorMessage = errors[FIELD_NAME]?.message as string

  useEffect(() => {
    if (supplierDatas.length > 0) {
      const index = supplierDatas.findIndex(
        (supplier: Supplier) => supplier.supplier_id === SupplierIds.FECredit
      )
      if (index > -1) {
        handleClickSupplier(supplierDatas[index])
      }
    }
  }, [])

  function handleClickSupplier(supplier: Supplier) {
    clearErrors(FIELD_NAME)
    clearErrors(FIELD_NAME_CUSTOMER_CODE)
    setSelectedSupplier(supplier)
    setValue(FIELD_NAME, supplier)
  }

  function renderSupplier(supplier: Supplier) {
    const isSelected = supplier.supplier_id === selectedSupplier.supplier_id
    return (
      <button
        type="button"
        key={supplier.supplier_id}
        className="flex w-full items-center justify-center gap-x-3 rounded-lg bg-white-500 px-3 py-2.5 text-label-lg shadow-[0_2px_12px_0] shadow-dark-500/5"
        onClick={() => handleClickSupplier(supplier)}
      >
        {supplier.icon && (
          <Image
            src={cpsImageUrlWithPath(`logo/${supplier?.icon}.png`)}
            alt="supplier-logo"
            width={36}
            height={36}
            loader={imageLoader}
          />
        )}
        <p className="line-clamp-2 text-left" style={{ width: 'calc(100% - 84px)' }}>
          {supplier.name}
        </p>
        <CheckBoxIcon isSelected={isSelected} />
      </button>
    )
  }

  function renderBody() {
    if (isMobile) {
      return (
        <>
          <div className="mt-3" />
          <SeletBottomSheet
            title="Chọn nhà cung cấp"
            optionDatas={supplierDatas.map(({ supplier_id, name, icon, ...others }) => ({
              supplier_id,
              name,
              icon,
              passData: JSON.stringify(others),
            }))}
            selectedOptionID={selectedSupplier.supplier_id}
            onOptionClick={({ supplier_id, name, icon, passData = '' }) => {
              handleClickSupplier({ supplier_id, name, icon, ...JSON.parse(passData) })
            }}
          />
          {errorMessage && (
            <label className="mt-1 line-clamp-2 text-label-md text-red-500">{errorMessage}</label>
          )}
        </>
      )
    }
    return (
      <>
        {errorMessage && (
          <label className="mt-1 line-clamp-2 text-label-md text-red-500">{errorMessage}</label>
        )}
        <div
          className={classNames({
            'mt-3 grid w-full grid-cols-3 gap-3 overflow-hidden whitespace-normal py-3': true,
          })}
          style={{
            transition: 'max-height 250ms ease',
            maxHeight: `${isShownAll ? maxHeightAll : maxHeight}px`,
          }}
        >
          {supplierDatas.map(renderSupplier)}
        </div>
        {supplierDatas.length > maxShownRows * 3 && (
          <div className="mt-3">
            <button
              type="button"
              className="mx-auto flex w-fit items-center gap-x-1"
              onClick={() => {
                setShownAll(!isShownAll)
              }}
            >
              <label className="pointer-events-none w-[70px] text-right text-label-md font-bold text-blue-500">
                {isShownAll ? 'Thu gọn' : 'Xem thêm'}
              </label>
              <span
                className={classNames({
                  'bg-conver pointer-events-none h-[16px] w-[16px] bg-center bg-no-repeat': true,
                  'rotate-180': !isShownAll,
                })}
                style={{ backgroundImage: `url('${ArrowUp}')` }}
              />
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <input
        {...register(FIELD_NAME, {
          validate: { required: (value) => value.supplier_id > 0 || 'Bạn chưa chọn nhà cung cấp' },
        })}
        style={{ display: 'none' }}
      />
      {renderBody()}
    </>
  )
}
