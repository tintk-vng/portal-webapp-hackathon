'use client'

import { UsageGuide } from '@/components/common/google-play-tutorial/usage-guide'
import PaymentButton from '@/components/common/payment-button'
import { AppID, TelcoCode } from '@/constants/telco'
import { DataSupplier } from '@/types/telco'
import dynamic from 'next/dynamic'
import { useContext, useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import useCreateOrder from '../../_hooks/useCreateOrder'
import { GameContext } from '../main'
import { StateType } from '../state'

const Dialog = dynamic(() => import('@/components/common/dialog'))

export default function BuyNowButton() {
  const { onScrollToView } = useContext(GameContext)
  const { control, handleSubmit } = useFormContext()
  const selectedSupplier = useWatch({
    control,
    name: 'supplier',
  }) as DataSupplier
  const stateType = useWatch({
    control,
    name: 'stateType',
  }) as StateType
  const { handleCreateOrder } = useCreateOrder()
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const [dialogValue, setDialogValue] = useState<{
    title: string
    description: string
    primaryCTAText: string
    onPrimaryCTAClick: () => void
  }>({
    title: '',
    description: '',
    primaryCTAText: '',
    onPrimaryCTAClick: () => {},
  })
  const dialogVisibleRef = useRef<boolean>(dialogVisible)

  useEffect(() => {
    dialogVisibleRef.current = dialogVisible
  }, [dialogVisible])

  const handleDialogClose = (view: string) => {
    setDialogVisible(!dialogVisibleRef.current)
    onScrollToView(view)
  }

  const handlePayNowClick = (successCallback: () => void) => {
    if (selectedSupplier.telcoCode === TelcoCode.INVALID) {
      setDialogVisible(true)
      setDialogValue({
        title: 'Bạn chưa chọn nhà cung cấp',
        description: 'Vui lòng chọn nhà cung cấp',
        primaryCTAText: 'Chọn nhà cung cấp',
        onPrimaryCTAClick: () => handleDialogClose('suppliers'),
      })
      return
    }
    handleSubmit(
      (data) => {
        successCallback()
      },
      (e) => {
        if (!e.supplier?.message && !e.email?.message && e.package?.message) {
          setDialogVisible(true)
          setDialogValue({
            title: 'Bạn chưa chọn mệnh giá',
            description: e.package.message as string,
            primaryCTAText: 'Chọn mệnh giá',
            onPrimaryCTAClick: () => handleDialogClose('packages'),
          })
        }
      }
    )()
  }

  const paymentAppID =
    selectedSupplier.telcoCode === TelcoCode.GOOGLEPLAY ? AppID.GOOGLEPLAY : AppID.GAME

  return (
    <>
      <PaymentButton
        appID={paymentAppID}
        CTAText="Thanh toán"
        isDisabled={stateType === StateType.MAINTENANCE}
        className="md:!mb-6"
        belowPrimaryCTA={
          selectedSupplier?.telcoCode === TelcoCode.GOOGLEPLAY ? <UsageGuide /> : null
        }
        onOrderConfirm={handleCreateOrder}
        onPayNowClick={handlePayNowClick}
      />

      {dialogVisible && (
        <Dialog visible={dialogVisible} onClose={() => setDialogVisible(false)} {...dialogValue} />
      )}
    </>
  )
}
