'use client'

import comboAPI from '@/api-client/telco/combo'
import dataTopupAPI from '@/api-client/telco/data-topup'
import PaymentButton from '@/components/common/payment-button'
import { AppID } from '@/constants/telco'
import useIframe from '@/hooks/use-iframe'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useContext, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { DataTopupContext } from '../main'

const Dialog = dynamic(() => import('@/components/common/dialog'))

export default function TopupNowButton() {
  const { selectedSupplier, onScrollToView } = useContext(DataTopupContext)
  const { getValues, handleSubmit } = useFormContext()
  const isInIframe = useIframe()
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
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm_source') || ''

  useEffect(() => {
    dialogVisibleRef.current = dialogVisible
  }, [dialogVisible])

  const handleDialogClose = () => {
    setDialogVisible(!dialogVisibleRef.current)
    onScrollToView('packages')
  }

  const handleCreateOrder = async (failureCallback: () => void) => {
    try {
      let response: any
      const dataPackage = getValues('package')
      if (dataPackage.appID === AppID.COMBO) {
        response = await comboAPI.createOrder({
          email: getValues('email'),
          voucherCode: getValues('voucherCode'),
          packageID: dataPackage.ID,
          phoneNumber: getValues('phoneNumber'),
          telcoCode: selectedSupplier.telcoCode,
          utmSource,
        })
      } else {
        response = await dataTopupAPI.createOrder({
          email: getValues('email'),
          voucherCode: getValues('voucherCode'),
          packageID: dataPackage.ID,
          phoneNumber: getValues('phoneNumber'),
          telcoCode: selectedSupplier.telcoCode,
          utmSource,
        })
      }
      if (isInIframe) {
        setTimeout(() => {
          window.open(response.order_url, '_blank')
        })
      } else {
        window.location.href = response.order_url
      }
    } catch (error) {
      console.log('Failed to create order: ', error)
      failureCallback()
    }
  }

  const handlePayNowClick = (successCallback: () => void) => {
    handleSubmit(
      (data) => {
        successCallback()
      },
      (e) => {
        if (!e.phoneNumber?.message && !e.email?.message && e.package?.message) {
          setDialogVisible(true)
          setDialogValue({
            title: 'Bạn chưa chọn mệnh giá',
            description: e.package.message as string,
            primaryCTAText: 'Chọn mệnh giá',
            onPrimaryCTAClick: handleDialogClose,
          })
        }
      }
    )()
  }

  return (
    <>
      <PaymentButton
        appID={AppID.DATA_TOPUP}
        CTAText="Nạp ngay"
        onOrderConfirm={handleCreateOrder}
        onPayNowClick={handlePayNowClick}
      />

      {dialogVisible && (
        <Dialog visible={dialogVisible} onClose={() => setDialogVisible(false)} {...dialogValue} />
      )}
    </>
  )
}
