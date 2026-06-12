'use client'

import EmailInput from '@/app/telco/_components/email-input'
import { AppID } from '@/constants/telco'
import { MutableRefObject } from 'react'

interface InvoiceInputProps {
  innerRef: MutableRefObject<HTMLInputElement | null>
}

export default function InvoiceInput({ innerRef }: InvoiceInputProps) {
  return (
    <div className="mb-6 mt-3">
      <EmailInput innerRef={innerRef} appID={AppID.COMBO} />
    </div>
  )
}
