'use client'

import EmailInput from '@/app/telco/_components/email-input'
import { AppID, ProductID } from '@/constants/telco'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import PayNowButton from '../pay-now-button'

const GotItVoucherInput = dynamic(() => import('@/components/common/gotit-voucher-input'))

export default function OtherBillInvoiceInput() {
  const emailInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <div className="mb-6 mt-3">
        <EmailInput innerRef={emailInputRef} appID={AppID.POST_PAID} />
      </div>

      <GotItVoucherInput productID={ProductID.POST_PAID} />

      <PayNowButton />
    </>
  )
}
