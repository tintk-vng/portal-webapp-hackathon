import { useEffect, useState } from 'react'
import PackagesItem from '../packages-item'
import billAPI, { getCatalogPath } from '@/api-client/bill'
import { useSearchParams } from 'next/navigation'
import { IPackageItemProps, b64DecodeUnicode, getKPlusInfo } from '@/utils/bill'
import useSWR from 'swr'
import { AppID, PackageType } from '@/constants/bill'
import { SupplierIds } from '../../../const'
import billModel from '@/models/bill/tv'
import { IBill, IBillInfo } from '@/types/bill'
import { Controller, useForm, useFormContext } from 'react-hook-form'

interface IKPlus {
  billInfo: IBillInfo
  onGetDefaultPackage?: Function
}

const KPlus = ({ billInfo, onGetDefaultPackage = () => {} }: IKPlus) => {
  const { control } = useFormContext()
  const searchParams = useSearchParams()
  const [pkgs, setPkgs] = useState<IPackageItemProps[]>([])
  const [durations, setDurations] = useState<IPackageItemProps[]>([])
  const [selectingPkgIndex, setSelectingPkgIndex] = useState(0)
  const [selectingDurationIndex, setSelectingDurationIndex] = useState(0)
  const customerCode = b64DecodeUnicode(searchParams?.get('customercode') ?? '')
  const { data: _catalog } = useSWR(
    getCatalogPath({ customerCode, appId: AppID.TELEVISION, supplierId: SupplierIds.KPlus }),
    () =>
      billAPI.getCatalog({ customerCode, appId: AppID.TELEVISION, supplierId: SupplierIds.KPlus }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      errorRetryCount: 2,
    }
  )

  const catalog = billModel.modelCatalog(_catalog)

  useEffect(() => {
    if (catalog && billInfo) {
      const _pkgs = getKPlusInfo(billInfo, catalog)
      if (_pkgs.length > 0) {
        setPkgs(_pkgs)
        setDurations(_pkgs[0].extendData)
        _pkgs.forEach((pkg, pkgIndex) => {
          if (pkg.isChecking) {
            setSelectingPkgIndex(pkgIndex)
            pkg.extendData.forEach((duration: IPackageItemProps, durationIndex: number) => {
              if (pkg.isChecking && duration.isChecking) {
                setSelectingDurationIndex(durationIndex)
                setDurations(pkg.extendData)
                onGetDefaultPackage([_pkgs[pkgIndex].extendData[durationIndex].extendData])
              }
            })
          }
        })
      }
    }
  }, [catalog, billInfo.bills])

  const onChangePkg = (type: PackageType, index: number) => {
    if (selectingPkgIndex !== index) {
      setDurations(pkgs[index].extendData)
      setSelectingPkgIndex(index)
      setSelectingDurationIndex(0)
    }
  }

  const onChangeDuration = (type: PackageType, index: number) => {
    setSelectingDurationIndex(index)
  }
  const handleSelectPackage = (bill: IBill, cb: (...event: any[]) => void) => {
    cb([bill])
  }

  return (
    <>
      <Controller
        control={control}
        name="bills"
        render={({ field: { onChange, value } }) => {
          return (
            <>
              <PackagesItem
                title="Chọn gói dịch vụ"
                column={2}
                selectingIndex={selectingPkgIndex}
                type={PackageType.PackageKPlus}
                list={pkgs}
                onItemClick={(type, index) => {
                  onChangePkg(type, index)
                  if (selectingPkgIndex !== index) {
                    handleSelectPackage(pkgs[index].extendData[0].extendData, onChange)
                  }
                }}
              />
              <PackagesItem
                title="Chọn thời gian gia hạn"
                column={2}
                selectingIndex={selectingDurationIndex}
                type={PackageType.DurationKPlus}
                list={durations}
                onItemClick={(type, index) => {
                  if (type === PackageType.DurationKPlus) {
                    onChangeDuration(type, index)
                    handleSelectPackage(durations[index].extendData, onChange)
                  }
                }}
              />
            </>
          )
        }}
      />
    </>
  )
}
export default KPlus
