'use client'

import StaticImage from '@/components/common/static-image'
import { AppID, EVENT } from '@/constants/telco'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect } from 'react'

const BottomSheet = dynamic(() => import('@/components/common/bottom-sheet'))
const Modal = dynamic(() => import('@/components/common/modal'))

interface PackageDetailsBottomSheetProps {
  comboPackage: DataPackage
  visible: boolean
  onClose: () => void
}

export default function PackageDetailsBottomSheet({
  comboPackage,
  visible,
  onClose,
}: PackageDetailsBottomSheetProps) {
  const { size } = useScreen()
  const { name, duration, features } = comboPackage
  const descriptions = features[0]?.descriptions || []

  useEffect(() => {
    if (visible) {
      commonUtil.trackEvent({
        ID: EVENT[AppID.COMBO].SHOW_PACKAGE_DETAILS_POPUP,
        metaData: {
          package: comboPackage,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleClose = () => {
    commonUtil.trackEvent({ ID: EVENT[AppID.COMBO].CLOSE_PACKAGE_DETAILS_POPUP })
    onClose()
  }

  const handleUnderstoodClick = () => {
    commonUtil.trackEvent({ ID: EVENT[AppID.COMBO].CLICK_UNDERSTOOD_BUTTON })
    onClose()
  }

  return (
    <>
      {size === ScreenSize.SMALL && (
        <BottomSheet
          visible={visible}
          onClose={handleClose}
          primaryCTAText="Đã hiểu"
          onPrimaryCTAClick={handleUnderstoodClick}
        >
          <div className="flex flex-col items-center">
            <Image
              src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/notify.svg"
              width={120}
              height={120}
              alt="notification-artwork"
            />

            <label className="mb-4 mt-6 text-label-lg font-bold">
              Thông tin gói cước {name} - {duration.display}
            </label>

            {!commonUtil.isEmpty(descriptions) && (
              <ul className="w-full space-y-4 p-4 pt-0">
                {descriptions!.map((description, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <StaticImage
                      className="!h-6 !w-6 min-w-[24px]"
                      src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/circle_check.svg"
                      width={24}
                      height={24}
                      alt="check-icon"
                    />

                    <label className="text-label-lg text-dark-400">{description}</label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </BottomSheet>
      )}

      {size !== ScreenSize.SMALL && (
        <Modal
          visible={visible}
          onClose={handleClose}
          primaryCTAText="Đã hiểu"
          onPrimaryCTAClick={handleUnderstoodClick}
        >
          <div className="flex flex-col items-center">
            <Image
              src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/notify.svg"
              width={150}
              height={150}
              alt="notification-artwork"
            />

            <div className="mb-4 mt-6 text-heading-lg">
              Thông tin gói cước {name} - {duration.display}
            </div>

            {!commonUtil.isEmpty(descriptions) && (
              <ul className="w-full space-y-4">
                {descriptions!.map((description, index) => (
                  <li key={index} className="flex items-center">
                    <StaticImage
                      className="!mr-2 !h-6 !w-6"
                      src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/circle_check.svg"
                      width={16}
                      height={16}
                      alt="check-icon"
                    />

                    <label className="text-label-lg text-dark-400">{description}</label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
