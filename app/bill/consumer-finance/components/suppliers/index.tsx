import Image from '@/components/common/image'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import SelectBottomSheet from '../select-bottom-sheet'
import { cpsImageUrlWithPath, imageLoader } from '@/utils/bill'
import { Supplier } from '@/types/bill'
import { SupplierID } from '@/constants/bill'
import { useSearchParams } from 'next/navigation'

const ArrowUp = '/images/icons/primary_arrow_up_ic16.svg'
const maxShownRows = 3
const maxRows = 3
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
  const searchParams = useSearchParams()
  const defaultSupplierID = Number(searchParams?.get('supplierid') || undefined)

  useEffect(() => {
    if (!Array.isArray(supplierDatas) || !supplierDatas?.length) {
      return
    }
    console.log('supplierDatas', supplierDatas)
    if (defaultSupplierID) {
      const defaultSupplierIndex = supplierDatas.findIndex(
        (supplier: Supplier) => supplier.ID === defaultSupplierID.toString()
      )
      if (defaultSupplierIndex > -1) {
        handleClickSupplier(supplierDatas[defaultSupplierIndex])
      }
      if (defaultSupplierIndex > maxShownRows * maxRows) {
        setShownAll(true)
      }
    } else {
      const feCreditSupplier = supplierDatas.find(
        (supplier: Supplier) => supplier.ID === SupplierID.FE_CREDIT.toString()
      )
      if (feCreditSupplier) {
        handleClickSupplier(feCreditSupplier)
      } else {
        handleClickSupplier(supplierDatas[0])
      }
    }
  }, [supplierDatas, defaultSupplierID, handleClickSupplier])

  function handleClickSupplier(supplier: Supplier) {
    clearErrors(FIELD_NAME)
    clearErrors(FIELD_NAME_CUSTOMER_CODE)
    setSelectedSupplier(supplier)
    setValue(FIELD_NAME, supplier)
  }

  function renderSupplier(supplier: Supplier) {
    const isSelected = supplier.ID === selectedSupplier.ID
    return (
      <button
        type="button"
        key={`supplier-${supplier.ID}`}
        className={classNames({
          'flex h-[62px] w-full items-center justify-center gap-x-3 rounded-lg border px-3 py-2.5 md:hover:border-blue-500 md:hover:bg-other-background [&>*]:pointer-events-none':
            true,
          'border-blue-500 bg-other-background': isSelected,
          'border-dark-50 bg-white-500': !isSelected,
        })}
        onClick={() => handleClickSupplier(supplier)}
      >
        {supplier.icon && (
          <Image
            src={cpsImageUrlWithPath(`logo/${supplier?.icon}_v2.svg`)}
            alt="supplier-logo"
            width={36}
            height={36}
            loader={imageLoader}
          />
        )}
        <p className="line-clamp-2 text-left" style={{ width: 'calc(100% - 84px)' }}>
          {supplier.name}
        </p>
      </button>
    )
  }

  function renderBody() {
    if (isMobile) {
      return (
        <>
          <div className="mt-3" />
          <SelectBottomSheet
            title="Chọn nhà cung cấp"
            optionDatas={supplierDatas.map(({ ID, name, icon, ...others }) => ({
              ID,
              name,
              icon,
              passData: JSON.stringify(others),
            }))}
            selectedOptionID={selectedSupplier.ID}
            onOptionClick={({ ID, name, icon, passData = '' }) => {
              handleClickSupplier({ ID, name, icon, ...JSON.parse(passData) })
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
        {supplierDatas.length > maxShownRows * maxRows && (
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
                  'pointer-events-none h-[16px] w-[16px] bg-cover bg-center bg-no-repeat': true,
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
          validate: { required: (value) => Boolean(value.ID) || 'Bạn chưa chọn nhà cung cấp' },
        })}
        style={{ display: 'none' }}
      />
      {renderBody()}
    </>
  )
}
