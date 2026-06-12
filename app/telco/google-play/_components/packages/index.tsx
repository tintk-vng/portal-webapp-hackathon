import { AppID, EVENT, PackageStatus } from '@/constants/telco'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import { RefObject, useContext, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { GooglePlayContext } from '../main'
import GooglePlayPackage from './google-play-package'

// const Popup = dynamic(() => import('@/components/common/popup'))

const DEFAULT_PACKAGE_PRICE = 100000
// const STORAGE_KEY = 'google_play_greeting_popup'

// const getDisplayTimes = async () => {
//   try {
//     const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '')
//     const displayTimes = value?.display_times || 0
//     return displayTimes
//   } catch (error) {
//     console.log('Failed to get display times from storage: ', error)
//     return undefined
//   }
// }

// const setDisplayTimes = (displayTimes: number) => {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify({ display_times: displayTimes }))
//   } catch (error) {
//     console.log('Failed to set display times from storage: ', error)
//   }
// }

interface PackagesProps {
  innerRef: RefObject<HTMLDivElement>
}

export default function Packages({ innerRef }: PackagesProps) {
  const { isLoading, selectedSupplier, onAmountChange, onScrollToView } =
    useContext(GooglePlayContext)
  const { control, getValues, setValue, setFocus } = useFormContext()
  const { packages } = selectedSupplier.packageGroups?.[0] || {
    packages: Array.apply({}, Array(9)),
  }
  // const [isVisible, toggle] = useToggle()

  // const handleGreetingPopupVisible = async () => {
  //   const displayTimes = await getDisplayTimes()
  //   if (displayTimes >= Number.MAX_SAFE_INTEGER) {
  //     return
  //   }
  //   const updatedDisplayTimes = displayTimes + 1
  //   setDisplayTimes(updatedDisplayTimes)
  //   toggle()
  // }

  const setDefaultPackage = () => {
    try {
      let activePackage = packages.find(
        (googlePlayPackage) =>
          googlePlayPackage.amount === DEFAULT_PACKAGE_PRICE &&
          googlePlayPackage.status === PackageStatus.ACTIVE
      )
      if (!activePackage) {
        activePackage = packages.find(
          (googlePlayPackage) => googlePlayPackage.status === PackageStatus.ACTIVE
        )
      }
      if (activePackage) {
        setValue('package', activePackage)
        const quantity = getValues('quantity')
        onAmountChange(activePackage.amount * quantity)
      }
    } catch (error) {
      console.log('Failed to set default package: ', error)
    }
  }

  useEffect(() => {
    if (!isLoading && !commonUtil.isEmpty(selectedSupplier)) {
      setDefaultPackage()
      // handleGreetingPopupVisible()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, selectedSupplier])

  const handlePackageSelect = (googlePlayPackage: DataPackage, cb: (...event: any[]) => void) => {
    const isMaintained = googlePlayPackage.status === PackageStatus.MAINTENANCE
    if (isMaintained) {
      return
    }
    commonUtil.trackEvent({
      ID: EVENT[AppID.GOOGLEPLAY].SELECT_PACKAGE,
      metaData: { package: googlePlayPackage },
    })
    const quantity = getValues('quantity')
    onAmountChange(googlePlayPackage.amount * quantity)
    cb(googlePlayPackage)
    onScrollToView('invoice-input')
    setTimeout(() => {
      setFocus('email')
    }, 500)
  }

  // const handlePopupClose = () => {
  //   toggle()
  // }

  // const handleTutorialView = () => {
  //   toggle()
  //   onScrollToView('tutorial')
  // }

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
            {packages.map(
              (googlePlayPackage = {} as DataPackage, index) =>
                googlePlayPackage.amount > 0 && (
                  <li
                    key={googlePlayPackage.ID || index}
                    onClick={() => handlePackageSelect(googlePlayPackage, onChange)}
                  >
                    <GooglePlayPackage
                      googlePlayPackage={googlePlayPackage}
                      selectedPackage={value}
                    />
                  </li>
                )
            )}
          </ul>
        )}
      />

      {/* {isVisible && (
        <Popup
          visible={isVisible}
          imgSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/banners_v2/google_play_2.svg"
          title="Mã thẻ Google Play đã ra mắt"
          description={`Một mã, vô vàn cách chơi. Hàng triệu trò chơi, ứng dụng, v.v, đáp ứng nhu cầu của bất kỳ ai.\n\nNạp tiền vào tài khoản Google Play và thanh toán cho những trò chơi, ứng dụng, phim, âm nhạc, sách,... vô cùng dễ dàng. Trải nghiệm ngay!`}
          onClose={handlePopupClose}
          primaryCTAText="Đã hiểu"
          onPrimaryCTAClick={handlePopupClose}
          secondaryCTAText="Hướng dẫn sử dụng"
          onSecondaryCTAClick={handleTutorialView}
        />
      )} */}
    </div>
  )
}
