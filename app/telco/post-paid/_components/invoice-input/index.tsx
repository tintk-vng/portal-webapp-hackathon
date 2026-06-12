'use client'

import { PaymentRule } from '@/constants/common'
import dynamic from 'next/dynamic'
import { useContext } from 'react'
import { BillInfoContext } from '../bill-info'

const InputBillInvoiceInput = dynamic(() => import('./input-bill-invoice-input'))
const OtherBillInvoiceInput = dynamic(() => import('./other-bill-invoice-input'))

export default function InvoiceInput() {
  const { billInfo } = useContext(BillInfoContext)
  const { paymentRule } = billInfo

  switch (paymentRule) {
    case PaymentRule.INPUT_BILL:
      return <InputBillInvoiceInput />
    default:
      return <OtherBillInvoiceInput />
  }
}
