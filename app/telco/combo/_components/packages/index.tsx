import comboAPI from '@/api-client/telco/combo'
import {
  API_PATH,
  AppID,
  DataPackageGroupType,
  EVENT,
  PackageStatus,
  ProductID,
  SupplierStatus,
  TelcoCode,
} from '@/constants/telco'
import useCustomSWR from '@/hooks/use-custom-swr'
import useToggle from '@/hooks/use-toggle'
import comboModel from '@/models/telco/combo'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'
import { RefObject, useContext, useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { ComboContext, defaultSupplier } from '../main'
import InvoiceInput from '../invoice-input'
import { StateType } from '../state'
import SkeletonState from '../state/skeleton-state'
import TopupNowButton from '../topup-now-button'
import ComboPackage from './combo-package'
import SkeletonPackageGroup from './skeleton-package-group'

const PackageDetailsBottomSheet = dynamic(() => import('./package-details-bottom-sheet'))
const State = dynamic(() => import('../state'), {
  loading: () => <SkeletonState />,
})
const GotItVoucherInput = dynamic(() => import('@/components/common/gotit-voucher-input'))

interface PackagesProps {
  innerRef: RefObject<HTMLUListElement>
}

export default function Packages({ innerRef }: PackagesProps) {
  const { suppliers, selectedSupplier } = useContext(ComboContext)
  const { control, getValues, setValue, setFocus } = useFormContext()
  const selectedPhoneNumber = getValues('phoneNumber')
  const selectedTelcoCode = selectedSupplier.telcoCode
  const [shouldFetch, setShouldFetch] = useState(false)
  const { data, error, isLoading } = useCustomSWR(
    () =>
      shouldFetch
        ? `${API_PATH[AppID.COMBO].GET_SUPPLIERS}/${selectedTelcoCode}/packages?type=${
            DataPackageGroupType.DYNAMIC
          }&phone_number=${selectedPhoneNumber}`
        : null,
    () =>
      comboAPI.getPackages({
        telcoCode: selectedTelcoCode,
        type: DataPackageGroupType.DYNAMIC,
        phoneNumber: selectedPhoneNumber,
      })
  )
  const dynamicPackageGroups = comboModel.modelPackages(data)
  const {
    data: staticData,
    error: staticError,
    isLoading: isStaticLoading,
  } = useCustomSWR(
    () =>
      shouldFetch
        ? `${API_PATH[AppID.COMBO].GET_SUPPLIERS}/${selectedTelcoCode}/packages?type=${
            DataPackageGroupType.STATIC
          }&phone_number=${selectedPhoneNumber}`
        : null,
    () =>
      comboAPI.getPackages({
        telcoCode: selectedTelcoCode,
        type: DataPackageGroupType.STATIC,
        phoneNumber: selectedPhoneNumber,
      })
  )
  const staticPackageGroups = comboModel.modelPackages(staticData)
  const [visible, toggle] = useToggle()
  const invoiceInputRef = useRef<HTMLInputElement | null>(null)
  const currentPackage = useRef({} as DataPackage)
  const isValidPhoneNumber =
    selectedTelcoCode !== TelcoCode.INVALID && selectedPhoneNumber.length === 10
  const packageGroups = isValidPhoneNumber
    ? [...staticPackageGroups, ...dynamicPackageGroups]
    : defaultSupplier.packageGroups

  useEffect(() => {
    setShouldFetch(isValidPhoneNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppliers])

  const setDefaultPackage = () => {
    try {
      packageGroups.every((packageGroup) => {
        const activeComboPackage = packageGroup.packages.find(
          (dataPackage) => dataPackage.status === PackageStatus.ACTIVE
        )
        if (activeComboPackage) {
          setValue('package', activeComboPackage)
          return false
        }
        return true
      })
    } catch (error) {
      console.log('Failed to set default package: ', error)
    }
  }

  useEffect(() => {
    if (isLoading && isStaticLoading) {
      return
    }
    setDefaultPackage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isStaticLoading])

  useEffect(() => {
    if (selectedSupplier.status === SupplierStatus.ACTIVE) {
      setDefaultPackage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSupplier])

  if (error && staticError) {
    const errorStatus = error?.response?.status || staticError?.response?.status
    if (errorStatus === 400) {
      return (
        <State
          type={StateType.EMPTY_PACKAGE}
          extraInfo={{ telcoCode: selectedSupplier.telcoCode }}
        />
      )
    }

    return (
      <State type={StateType.MAINTENANCE} extraInfo={{ telcoCode: selectedSupplier.telcoCode }} />
    )
  }

  if (!isLoading && !isStaticLoading && commonUtil.isEmpty(packageGroups)) {
    return (
      <State type={StateType.EMPTY_PACKAGE} extraInfo={{ telcoCode: selectedSupplier.telcoCode }} />
    )
  }

  const handlePackageSelect = (comboPackage: DataPackage, cb: (...event: any[]) => void) => {
    const isMaintained = comboPackage.status === PackageStatus.MAINTENANCE
    if (isMaintained) {
      return
    }
    commonUtil.trackEvent({
      ID: EVENT[AppID.COMBO].SELECT_PACKAGE,
      metaData: { package: comboPackage },
    })
    cb(comboPackage)
    invoiceInputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
    setTimeout(() => {
      setFocus('email')
    }, 500)
  }

  const handleViewDetailsClick = (comboPackage: DataPackage) => {
    commonUtil.trackEvent({
      ID: EVENT[AppID.COMBO].CLICK_VIEW_PACKAGE_DETAILS,
      metaData: { package: comboPackage },
    })
    currentPackage.current = comboPackage
    toggle()
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
                  required: `Vui lòng chọn mệnh giá bạn muốn nạp cho SĐT ${selectedPhoneNumber}`,
                }}
                render={({ field: { onChange, value } }) => (
                  <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {packages.map((comboPackage) => (
                      <li
                        key={comboPackage.ID}
                        onClick={() => handlePackageSelect(comboPackage, onChange)}
                      >
                        <ComboPackage
                          comboPackage={comboPackage}
                          selectedPackage={value}
                          onViewDetailsClick={handleViewDetailsClick}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              />
            </li>
          )
        })}

        {(isLoading || isStaticLoading) && (
          <li className="mb-6 last:mb-0">
            <SkeletonPackageGroup />
          </li>
        )}
      </ul>

      <InvoiceInput innerRef={invoiceInputRef} />

      <GotItVoucherInput productID={ProductID.COMBO} />

      <TopupNowButton />

      {visible && (
        <PackageDetailsBottomSheet
          comboPackage={currentPackage.current}
          visible={visible}
          onClose={toggle}
        />
      )}
    </>
  )
}
