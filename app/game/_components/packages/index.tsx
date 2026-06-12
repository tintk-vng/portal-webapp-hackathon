import { AppID, EVENT, PackageStatus, TelcoCode } from '@/constants/telco'
import { DataPackage, DataSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import { RefObject, useContext, useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { GameContext } from '../main'
import GamePackage from './GamePackage'

interface PackagesProps {
  innerRef: RefObject<HTMLDivElement>
}

export default function Packages({ innerRef }: PackagesProps) {
  const { onScrollToView } = useContext(GameContext)
  const { control, setValue, setFocus } = useFormContext()
  const selectedSupplier = useWatch({
    control,
    name: 'supplier',
  }) as DataSupplier
  const { packageGroups } = selectedSupplier
  const headerText =
    selectedSupplier?.telcoCode === TelcoCode.GOOGLEPLAY
      ? 'Chọn mệnh giá'
      : 'Chọn mệnh giá & số lượng'

  const setDefaultPackage = () => {
    packageGroups.every((packageGroup) => {
      const activePackage = packageGroup.packages.find(
        (dataPackage) => dataPackage.status === PackageStatus.ACTIVE
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
  }, [JSON.stringify(selectedSupplier)])

  const handlePackageSelect = (dataPackage: DataPackage, cb: (...event: any[]) => void) => {
    const isMaintained = dataPackage.status === PackageStatus.MAINTENANCE
    if (isMaintained) {
      return
    }
    commonUtil.trackEvent({
      ID: EVENT[AppID.GAME].SELECT_PACKAGE,
      metaData: { package: dataPackage },
    })
    cb(dataPackage)
    onScrollToView('email-input')
    setTimeout(() => {
      setFocus('email')
    }, 500)
  }

  return (
    <div ref={innerRef} className="mb-6">
      <div className="mb-3 text-heading-md md:mb-4 md:text-heading-lg">{headerText}</div>

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
              return packages.map((dataPackage) => (
                <li key={dataPackage.ID} onClick={() => handlePackageSelect(dataPackage, onChange)}>
                  <GamePackage dataPackage={dataPackage} selectedPackage={value} />
                </li>
              ))
            })}
          </ul>
        )}
      />
    </div>
  )
}
