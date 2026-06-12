import QuantitySpinner from '@/app/telco/_components/quantity-spinner'
import { AppID, EVENT, PackageStatus, ProductID } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'
import { RefObject, useContext, useEffect, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { DataCodeContext } from '../main'
import BuyNowButton from '../buy-now-button'
import InvoiceInput from '../invoice-input'
import { StateType } from '../state'
import SkeletonState from '../state/skeleton-state'
import DataCodePackage from './data-code-package'

const State = dynamic(() => import('../state'), {
  loading: () => <SkeletonState />,
})
const GotItVoucherInput = dynamic(() => import('@/components/common/gotit-voucher-input'))

interface PackagesProps {
  innerRef: RefObject<HTMLUListElement>
}

export default function Packages({ innerRef }: PackagesProps) {
  const { suppliers, selectedSupplier, onAmountChange } = useContext(DataCodeContext)
  const { control, getValues, setValue, setFocus } = useFormContext()
  const invoiceInputRef = useRef<HTMLInputElement | null>(null)
  const packageGroups =
    suppliers.find((supplier) => supplier.telcoCode === selectedSupplier.telcoCode)
      ?.packageGroups || selectedSupplier.packageGroups

  useEffect(() => {
    selectedSupplier.packageGroups.every((packageGroup) => {
      const activePackage = packageGroup.packages.find(
        (dataPackage) => dataPackage.status === PackageStatus.ACTIVE
      )
      if (activePackage) {
        setValue('package', activePackage)
        const quantity = getValues('quantity')
        onAmountChange(activePackage.amount * quantity)
        return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePackageSelect = (dataCodePackage: DataPackage, cb: (...event: any[]) => void) => {
    const isMaintained = dataCodePackage.status === PackageStatus.MAINTENANCE
    if (isMaintained) {
      return
    }
    commonUtil.trackEvent({
      ID: EVENT[AppID.DATA_CODE].SELECT_PACKAGE,
      metaData: { package: dataCodePackage },
    })
    const quantity = getValues('quantity')
    onAmountChange(dataCodePackage.amount * quantity)
    cb(dataCodePackage)
    invoiceInputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
    setTimeout(() => {
      setFocus('email')
    }, 500)
  }

  if (commonUtil.isEmpty(packageGroups)) {
    return (
      <State type={StateType.EMPTY_PACKAGE} extraInfo={{ telcoCode: selectedSupplier.telcoCode }} />
    )
  }

  return (
    <>
      <ul ref={innerRef} className="mb-6">
        {packageGroups.map((packageGroup) => {
          const { ID, name, packages } = packageGroup
          if (commonUtil.isEmpty(packages)) {
            return null
          }

          return (
            <li key={ID} className="mb-6 last:mb-0">
              <div className="mb-3 text-heading-sm md:mb-4">{name}</div>

              <Controller
                control={control}
                name="package"
                rules={{
                  required: 'Vui lòng chọn mệnh giá bạn muốn mua',
                }}
                render={({ field: { onChange, value } }) => (
                  <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {packages.map((dataCodePackage) => (
                      <li
                        key={dataCodePackage.ID}
                        onClick={() => handlePackageSelect(dataCodePackage, onChange)}
                      >
                        <DataCodePackage
                          dataCodePackage={dataCodePackage}
                          selectedPackage={value}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              />
            </li>
          )
        })}
      </ul>

      <QuantitySpinner appID={AppID.DATA_CODE} onAmountChange={onAmountChange} />

      <InvoiceInput innerRef={invoiceInputRef} />

      <GotItVoucherInput productID={ProductID.DATA_CODE} />

      <BuyNowButton />
    </>
  )
}
