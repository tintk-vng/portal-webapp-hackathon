'use client'

import Button, { ButtonSize } from '@/components/common/button'
import Dialog from '@/components/common/dialog'
import { AppID, EVENT } from '@/constants/telco'
import useIframe from '@/hooks/use-iframe'
import useToggle from '@/hooks/use-toggle'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import Tnc from './Tnc'

const ConfirmationBottomSheet = dynamic(() => import('./ConfirmationBottomSheet'))

interface PaymentButtonProps {
  appID: AppID
  CTAText: string
  isDisabled?: boolean
  extraContent?: ReactElement
  /** Rendered after the primary CTA and before the policy note (e.g. HDSD on game checkout). */
  belowPrimaryCTA?: ReactNode
  className?: string
  onOrderConfirm: (failureCallback: () => void) => Promise<void>
  onPayNowClick: (successCallback: () => void) => void
}

export default function PaymentButton({
  appID,
  CTAText,
  isDisabled,
  extraContent,
  belowPrimaryCTA,
  className,
  onOrderConfirm,
  onPayNowClick,
}: PaymentButtonProps) {
  const isInIframe = useIframe()
  const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false)
  const [dialogVisible, dialogToggle] = useToggle()

  useEffect(() => {
    if (dialogVisible) {
      commonUtil.trackEvent({
        ID: EVENT[appID].SHOW_ERROR_DIALOG,
        metaData: {
          error_message: 'Hệ thống tạm thời gián đoạn. Bạn vui lòng thử lại.',
        },
      })
      bottomSheetVisible && setBottomSheetVisible(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogVisible])

  const handlePayNowClick = () => {
    commonUtil.trackEvent({ ID: EVENT[appID].CLICK_PAYMENT_BUTTON })
    onPayNowClick(() => setBottomSheetVisible(true))
  }

  const handleCreateOrder = async () => {
    commonUtil.trackEvent({ ID: EVENT[appID].CLICK_CONFIRM_BUTTON })
    onOrderConfirm(dialogToggle)
  }

  const handleCheckAgainClick = () => {
    commonUtil.trackEvent({ ID: EVENT[appID].CLICK_CHECK_AGAIN_BUTTON })
    setBottomSheetVisible(false)
  }

  const handleDialogClose = () => {
    commonUtil.trackEvent({ ID: EVENT[appID].CLICK_ERROR_DIALOG_CLOSE_BUTTON })
    dialogToggle()
    setBottomSheetVisible(true)
  }

  if (isInIframe) {
    return (
      <div className="mb-6 @4xl:mb-0">
        {extraContent}

        <Button
          isDisabled={isDisabled}
          width="w-full"
          size={ButtonSize.LARGE}
          onClick={handlePayNowClick}
        >
          {CTAText}
        </Button>

        {belowPrimaryCTA != null ? <div className="mt-3">{belowPrimaryCTA}</div> : null}

        <Tnc refCTAText={CTAText} />

        {bottomSheetVisible && (
          <ConfirmationBottomSheet
            appID={appID}
            visible={bottomSheetVisible}
            onClose={handleCheckAgainClick}
            onOrderConfirm={handleCreateOrder}
          />
        )}

        {dialogVisible && (
          <Dialog
            visible={dialogVisible}
            onClose={handleDialogClose}
            title="Thanh toán không thành công"
            description="Hệ thống tạm thời gián đoạn. Bạn vui lòng thử lại."
            primaryCTAText="Thử lại"
            onPrimaryCTAClick={handleDialogClose}
          />
        )}
      </div>
    )
  }

  return (
    <div
      className={classNames({
        'fixed bottom-0 left-0 right-0 z-10 bg-white-500 p-4 shadow-[0_2px_12px_0_rgba(0,31,62,0.05)] md:static md:mb-12 md:p-0 md:shadow-none':
          true,
        [`${className}`]: !!className,
      })}
    >
      {extraContent}

      <Button
        isDisabled={isDisabled}
        width="w-full"
        size={ButtonSize.LARGE}
        onClick={handlePayNowClick}
      >
        {CTAText}
      </Button>

      {belowPrimaryCTA != null ? <div className="mt-3">{belowPrimaryCTA}</div> : null}

      <Tnc refCTAText={CTAText} />

      <button
        className="flex"
        id="telco-one-click-payment-button"
        onClick={handleCreateOrder}
        style={{ visibility: 'hidden' }}
      />

      {bottomSheetVisible && (
        <ConfirmationBottomSheet
          appID={appID}
          visible={bottomSheetVisible}
          onClose={handleCheckAgainClick}
          onOrderConfirm={handleCreateOrder}
        />
      )}

      {dialogVisible && (
        <Dialog
          visible={dialogVisible}
          onClose={handleDialogClose}
          title="Thanh toán không thành công"
          description="Hệ thống tạm thời gián đoạn. Bạn vui lòng thử lại."
          primaryCTAText="Thử lại"
          onPrimaryCTAClick={handleDialogClose}
        />
      )}
    </div>
  )
}
