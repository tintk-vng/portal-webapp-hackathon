import { AppID, EVENT, PackageStatus } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import { RefObject, useContext, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TopupContext } from '../main'
import TopupPackage from './topup-package'

interface PackagesProps {
  innerRef: RefObject<HTMLDivElement>
}

export default function Packages({ innerRef }: PackagesProps) {
  const { suppliers, selectedSupplier, onScrollToView } = useContext(TopupContext)
  const { control, getValues, setValue, setFocus } = useFormContext()
  const selectedPhoneNumber = getValues('phoneNumber')
  const packageGroups =
    suppliers.find((supplier) => supplier.telcoCode === selectedSupplier.telcoCode)
      ?.packageGroups || selectedSupplier.packageGroups

  const setDefaultPackage = () => {
    selectedSupplier.packageGroups.every((packageGroup) => {
      const activePackage = packageGroup.packages.find(
        (topupPackage) =>
          topupPackage.amount === 50000 && topupPackage.status === PackageStatus.ACTIVE
      )
      if (activePackage) {
        setValue('package', activePackage)
        return false
      }
      return true
    })
  }

  useEffect(() => {
    setDefaultPackage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePackageSelect = (topupPackage: DataPackage, cb: (...event: any[]) => void) => {
    const isMaintained = topupPackage.status === PackageStatus.MAINTENANCE
    if (isMaintained) {
      return
    }
    commonUtil.trackEvent({
      ID: EVENT[AppID.TOPUP].SELECT_PACKAGE,
      metaData: { package: topupPackage },
    })
    cb(topupPackage)
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
          required: `Vui lòng chọn mệnh giá bạn muốn nạp cho SĐT ${selectedPhoneNumber}`,
        }}
        render={({ field: { onChange, value } }) => (
          <ul className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {packageGroups.map((packageGroup) => {
              const { packages } = packageGroup
              if (commonUtil.isEmpty(packages)) {
                return null
              }
              return packages.map((topupPackage) => (
                <li
                  key={topupPackage.ID}
                  onClick={() => handlePackageSelect(topupPackage, onChange)}
                >
                  <TopupPackage topupPackage={topupPackage} selectedPackage={value} />
                </li>
              ))
            })}
          </ul>
        )}
      />
    </div>
  )
}
