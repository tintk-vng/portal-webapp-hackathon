'use client'

import telcoAPI from '@/api-client/telco'
import PaymentButton from '@/components/common/payment-button'
import { AppID, ProductID, TelcoCode } from '@/constants/telco'
import useIframe from '@/hooks/use-iframe'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useContext, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { DataCodeContext } from '../main'
import TotalAmount from './total-amount'

const Dialog = dynamic(() => import('@/components/common/dialog'))

export default function BuyNowButton() {
  const { selectedSupplier, onScrollToView } = useContext(DataCodeContext)
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

  const handleDialogClose = (view: string) => {
    setDialogVisible(!dialogVisibleRef.current)
    onScrollToView(view)
  }

  const handleCreateOrder = async (failureCallback: () => void) => {
    try {
      const dataCodePackage = getValues('package')
      const response: any = await telcoAPI.createOrder({
        productID: ProductID.DATA_CODE,
        dataPackage: dataCodePackage,
        quantity: getValues('quantity'),
        email: getValues('email'),
        voucherCode: getValues('voucherCode'),
        utmSource,
      })
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
        if (!e.phoneNumber?.message && !e.email?.message && e.package?.message) {
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
        appID={AppID.DATA_CODE}
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
