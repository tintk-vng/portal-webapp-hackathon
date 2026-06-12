'use client'

import postPaidAPI from '@/api-client/telco/post-paid'
import PaymentButton from '@/components/common/payment-button'
import { AppID } from '@/constants/telco'
import useIframe from '@/hooks/use-iframe'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { BillInfoContext } from '../bill-info'

export default function PayNowButton() {
  const { billInfo } = useContext(BillInfoContext)
  const { getValues, handleSubmit } = useFormContext()
  const isInIframe = useIframe()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm_source') || ''

  const handlePayNowClick = (successCallback: () => void) => {
    handleSubmit((data) => {
      successCallback()
    })()
  }

  const handleCreateOrder = async (failureCallback: () => void) => {
    try {
      const email = getValues('email')
      const amount = getValues('amount')
      const orderParam = amount
        ? {
            billInfo: {
              ...billInfo.rawInfo,
              items: {
                bill_items: {
                  ...billInfo.rawInfo.items.bill_items,
                  bills: [
                    {
                      ...billInfo.rawInfo.items.bill_items.bills[0],
                      amount: Number(amount),
                    },
                  ],
                },
              },
              email,
              utm_source: utmSource,
              promotion_code: getValues('voucherCode'),
            },
          }
        : {
            billInfo: {
              ...billInfo.rawInfo,
              email,
              utm_source: utmSource,
              promotion_code: getValues('voucherCode'),
            },
          }
      const response: any = await postPaidAPI.createOrder(orderParam)
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

  return (
    <PaymentButton
      appID={AppID.POST_PAID}
      CTAText="Thanh toán ngay"
      onOrderConfirm={handleCreateOrder}
      onPayNowClick={handlePayNowClick}
    />
  )
}
