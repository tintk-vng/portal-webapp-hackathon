'use client'

import { AppID, EVENT } from '@/constants/telco'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

const BottomSheet = dynamic(() => import('@/components/common/bottom-sheet'))
const Modal = dynamic(() => import('@/components/common/modal'))

interface ConfirmationBottomSheetProps {
  appID: AppID
  visible: boolean
  onClose: () => void
  onOrderConfirm: () => Promise<void>
}

export default function ConfirmationBottomSheet({
  appID,
  visible,
  onClose,
  onOrderConfirm,
}: ConfirmationBottomSheetProps) {
  const { size } = useScreen()
  const { getValues } = useFormContext()
  const [isLoading, setIsLoading] = useState(false)
  const email = getValues('email')

  useEffect(() => {
    if (visible) {
      commonUtil.trackEvent({ ID: EVENT[appID].SHOW_CONFIRMATION_POPUP })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleCreateOrder = async () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    await onOrderConfirm()
    setIsLoading(false)
  }

  return (
    <>
      {size === ScreenSize.SMALL && (
        <BottomSheet
          visible={visible}
          onClose={onClose}
          primaryCTAText="Xác nhận"
          onPrimaryCTAClick={handleCreateOrder}
          secondaryCTAText="Kiểm tra lại"
          onSecondaryCTAClick={onClose}
        >
          <div className="flex flex-col items-center">
            <Image
              src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/notify.svg"
              width={120}
              height={120}
              alt="notification-artwork"
            />

            <label className="mb-2 mt-6 text-label-lg font-bold">Xác nhận thông tin</label>

            <label className="text-center text-label-md">
              Kết quả giao dịch sẽ được gửi tới địa chỉ email{' '}
              <label className="text-label-lg text-blue-500">{email}</label>
              <br />
              <br />
              Vui lòng xác nhận những thông tin cung cấp là hoàn toàn chính xác
            </label>
          </div>
        </BottomSheet>
      )}

      {size !== ScreenSize.SMALL && (
        <Modal
          visible={visible}
          onClose={onClose}
          primaryCTAText="Xác nhận"
          onPrimaryCTAClick={handleCreateOrder}
          secondaryCTAText="Kiểm tra lại"
          onSecondaryCTAClick={onClose}
        >
          <div className="flex flex-col items-center">
            <Image
              src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/notify.svg"
              width={150}
              height={150}
              alt="notification-artwork"
            />

            <div className="mb-2 mt-6 text-heading-lg">Xác nhận thông tin</div>

            <label className="text-center text-label-lg text-dark-400">
              Kết quả giao dịch sẽ được gửi tới địa chỉ email{' '}
              <label className="text-label-lg text-blue-500">{email}</label>
              <br />
              Vui lòng xác nhận những thông tin cung cấp là hoàn toàn chính xác
            </label>
          </div>
        </Modal>
      )}
    </>
  )
}
