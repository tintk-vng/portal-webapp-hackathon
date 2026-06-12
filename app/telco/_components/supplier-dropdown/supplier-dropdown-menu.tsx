import StaticImage from '@/components/common/static-image'
import { AppID, EVENT, SupplierStatus } from '@/constants/telco'
import useOutsideClick from '@/hooks/use-outside-click'
import { DataSupplier, PostPaidSupplier, TopupSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'

interface SupplierDropDownMenuProps {
  appID: AppID
  suppliers: Array<TopupSupplier | DataSupplier | PostPaidSupplier>
  selectedSupplier: TopupSupplier | DataSupplier | PostPaidSupplier
  visible: boolean
  onClose: () => void
  onSupplierChange: Function
}

export default function SupplierDropDownMenu({
  appID,
  suppliers,
  selectedSupplier,
  onSupplierChange,
  visible,
  onClose,
}: SupplierDropDownMenuProps) {
  const [supplierDropDownMenuClassName, setSupplierDropDownMenuClassName] = useState('')
  const supplierSelectRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    if (visible) {
      setSupplierDropDownMenuClassName('animate-appearance-in')
    }
  }, [visible])

  const handleClose = () => {
    setSupplierDropDownMenuClassName('animate-appearance-out')
    setTimeout(() => {
      onClose()
    }, 300)
  }

  useOutsideClick(supplierSelectRef, handleClose)

  if (!visible) {
    return null
  }

  const handleSupplierChange = (supplier: TopupSupplier | DataSupplier | PostPaidSupplier) => {
    commonUtil.trackEvent({
      ID: EVENT[appID].SELECT_SUPPLIER,
      metaData: {
        supplier: {
          telco_code: supplier.telcoCode,
          status: supplier.status,
        },
      },
    })
    onSupplierChange(supplier)
    onClose()
  }

  return (
    <ul
      ref={supplierSelectRef}
      className={classNames({
        'absolute right-[-1px] top-[48px] z-20 w-[168px] overflow-hidden rounded-lg bg-white-500 px-4 shadow-[0px_2px_12px_rgba(0,31,62,0.05)]':
          true,
        [supplierDropDownMenuClassName]: true,
      })}
    >
      {suppliers.map((supplier) => {
        const { telcoCode, status } = supplier
        const isSelectedSupplier = telcoCode === selectedSupplier.telcoCode

        if (status === SupplierStatus.INACTIVE) {
          return null
        }

        return (
          <li
            key={telcoCode}
            className="border-b border-dark-50 bg-white-500 last:border-b-0"
            onClick={() => handleSupplierChange(supplier)}
          >
            <div className="flex h-14 w-full cursor-pointer items-center justify-between space-x-4 py-3 md:transition-transform md:duration-300 md:hover:scale-110">
              <div className="relative flex h-full w-full items-center">
                <StaticImage
                  src={telcoUtil.getSupplierLogoByTelcoCode(telcoCode)}
                  fill
                  alt="supplier-logo"
                />
              </div>

              <span
                className={classNames({
                  'h-6 w-6 min-w-6 bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons/check.svg")] bg-contain bg-no-repeat':
                    true,
                  invisible: !isSelectedSupplier,
                })}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
