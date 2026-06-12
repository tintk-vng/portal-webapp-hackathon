import { AppID, EVENT, PackageStatus } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import { RefObject, useContext, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { PhoneCardContext } from '../main'
import PhoneCardPackage from './phone-card-package'

interface PackagesProps {
  innerRef: RefObject<HTMLDivElement>
}

export default function Packages({ innerRef }: PackagesProps) {
  const { suppliers, selectedSupplier, onAmountChange, onScrollToView } =
    useContext(PhoneCardContext)
  const { control, getValues, setValue, setFocus } = useFormContext()
  const packageGroups =
    suppliers.find((supplier) => supplier.telcoCode === selectedSupplier.telcoCode)
      ?.packageGroups || selectedSupplier.packageGroups

  const setDefaultPackage = () => {
    selectedSupplier.packageGroups.every((packageGroup) => {
      const activePackage = packageGroup.packages.find(
        (phoneCardPackage) =>
          phoneCardPackage.amount === 50000 && phoneCardPackage.status === PackageStatus.ACTIVE
      )
      if (activePackage) {
        setValue('package', activePackage)
        const quantity = getValues('quantity')
        onAmountChange(activePackage.amount * quantity)
        return false
      }
      return true
    })
  }

  useEffect(() => {
    setDefaultPackage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePackageSelect = (phoneCardPackage: DataPackage, cb: (...event: any[]) => void) => {
    const isMaintained = phoneCardPackage.status === PackageStatus.MAINTENANCE
    if (isMaintained) {
      return
    }
    commonUtil.trackEvent({
      ID: EVENT[AppID.PHONE_CARD].SELECT_PACKAGE,
      metaData: { package: phoneCardPackage },
    })
    const quantity = getValues('quantity')
    onAmountChange(phoneCardPackage.amount * quantity)
    cb(phoneCardPackage)
    onScrollToView('invoice-input')
    setTimeout(() => {
      setFocus('email')
    }, 500)
  }

  return (
    <div ref={innerRef} className="mb-6">
      <div className="mb-3 text-heading-sm md:mb-4">Chọn mệnh giá nạp</div>

      <Controller
        control={control}
        name="package"
        rules={{
          required: 'Vui lòng chọn mệnh giá',
        }}
        render={({ field: { onChange, value } }) => (
          <ul className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {packageGroups.map((packageGroup) => {
              const { packages } = packageGroup
              if (commonUtil.isEmpty(packages)) {
                return null
              }
              return packages.map((phoneCardPackage) => (
                <li
                  key={phoneCardPackage.ID}
                  onClick={() => handlePackageSelect(phoneCardPackage, onChange)}
                >
                  <PhoneCardPackage phoneCardPackage={phoneCardPackage} selectedPackage={value} />
                </li>
              ))
            })}
          </ul>
        )}
      />
    </div>
  )
}
