'use client'

import PaymentButton from '@/components/common/payment-button'
import { AppID, TelcoCode } from '@/constants/telco'
import dynamic from 'next/dynamic'
import { useContext, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { PhoneCardContext } from '../main'
import useCreateOrder from '../../_hooks/useCreateOrder'
import TotalAmount from './total-amount'

const Dialog = dynamic(() => import('@/components/common/dialog'))

export default function BuyNowButton() {
  const { selectedSupplier, onScrollToView } = useContext(PhoneCardContext)
  const { handleSubmit } = useFormContext()
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
        onPrimaryCTAClick: () => handleDialogClose('supplier-select'),
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

  return (
    <>
      <PaymentButton
        appID={AppID.PHONE_CARD}
        CTAText="Mua ngay"
        onOrderConfirm={handleCreateOrder}
        onPayNowClick={handlePayNowClick}
        extraContent={<TotalAmount />}
      />

      {dialogVisible && (
        <Dialog visible={dialogVisible} onClose={() => setDialogVisible(false)} {...dialogValue} />
      )}
    </>
  )
}
