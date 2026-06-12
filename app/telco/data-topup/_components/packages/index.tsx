import { AppID, EVENT, PackageStatus } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import { RefObject, useContext, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { DataTopupContext } from '../main'
import DataTopupPackage from './data-topup-package'

interface PackagesProps {
  innerRef: RefObject<HTMLUListElement>
}

export default function Packages({ innerRef }: PackagesProps) {
  const { suppliers, selectedSupplier, onScrollToView } = useContext(DataTopupContext)
  const { control, getValues, setValue, setFocus } = useFormContext()
  const selectedPhoneNumber = getValues('phoneNumber')
  const packageGroups =
    suppliers.find((supplier) => supplier.telcoCode === selectedSupplier.telcoCode)
      ?.packageGroups || selectedSupplier.packageGroups

  useEffect(() => {
    selectedSupplier.packageGroups.every((packageGroup) => {
      const activeDataPackage = packageGroup.packages.find(
        (dataPackage) => dataPackage.status === PackageStatus.ACTIVE
      )
      if (activeDataPackage) {
        setValue('package', activeDataPackage)
        return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePackageSelect = (dataTopupPackage: DataPackage, cb: (...event: any[]) => void) => {
    const isMaintained = dataTopupPackage.status === PackageStatus.MAINTENANCE
    if (isMaintained) {
      return
    }
    commonUtil.trackEvent({
      ID: EVENT[AppID.DATA_TOPUP].SELECT_PACKAGE,
      metaData: { package: dataTopupPackage },
    })
    cb(dataTopupPackage)
    onScrollToView('invoice-input')
    setTimeout(() => {
      setFocus('email')
    }, 500)
  }

  return (
    <ul ref={innerRef} className="mb-6">
      {packageGroups.map((packageGroup, groupIndex) => {
        const { ID, name, packages } = packageGroup
        if (commonUtil.isEmpty(packages)) {
          return null
        }

        return (
          <li key={`${ID}_${groupIndex}`} className="mb-6 last:mb-0">
            <div className="mb-3 text-heading-sm md:mb-4">{name}</div>

            <Controller
              control={control}
              name="package"
              rules={{
                required: `Vui lòng chọn mệnh giá bạn muốn nạp cho SĐT ${selectedPhoneNumber}`,
              }}
              render={({ field: { onChange, value } }) => (
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {packages.map((dataTopupPackage) => {
                    const { ID } = dataTopupPackage

                    return (
                      <li key={ID} onClick={() => handlePackageSelect(dataTopupPackage, onChange)}>
                        <DataTopupPackage
                          dataTopupPackage={dataTopupPackage}
                          selectedPackage={value}
                        />
                      </li>
                    )
                  })}
                </ul>
              )}
            />
          </li>
        )
      })}
    </ul>
  )
}
