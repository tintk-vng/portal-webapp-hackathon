import { PaymentRule } from '@/constants/common'
import { TELCO_NAME, TelcoCode } from '@/constants/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useContext, useEffect, useRef } from 'react'
import { BillInfoContext } from '.'

const BillCheck = dynamic(() => import('./bill-check'))

const parseBillTitle = (paymentRule: PaymentRule, displayMonth?: string) => {
  if (!displayMonth) {
    return 'Bạn cần thanh toán'
  }
  switch (paymentRule) {
    case PaymentRule.ALL_BILLS:
      return 'Bạn cần thanh toán'
    case PaymentRule.INPUT_BILL:
      return `Bạn có hoá đơn tháng ${displayMonth}`
    default:
      return `Nợ cước tháng ${displayMonth}`
  }
}

const parseBillTotalAmount = (paymentRule: PaymentRule, totalAmount: number) => {
  switch (paymentRule) {
    case PaymentRule.INPUT_BILL:
      return undefined
    default:
      return commonUtil.formatCurrency(totalAmount)
  }
}

const parseBillDescription = (telcoCode: TelcoCode, displayMonth?: string) => {
  if (!displayMonth) {
    return 'Cước ĐT trả sau'
  }
  switch (telcoCode) {
    case TelcoCode.MOBIFONE:
    case TelcoCode.VIETTEL:
      return `Cước ĐT trả sau đến T${displayMonth}`
    default:
      return `Cước ĐT trả sau T${displayMonth}`
  }
}

export default function BillDetails() {
  const { billInfo } = useContext(BillInfoContext)
  const billDetailsRef = useRef<HTMLDivElement | null>(null)
  const { bills, paymentRule, supplierID, customerCode, totalAmount } = billInfo
  const paymentAmount = parseBillTotalAmount(paymentRule, totalAmount)
  const telcoCode = telcoUtil.getTelcoCodeBySupplierID(supplierID)

  useEffect(() => {
    billDetailsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }, [])

  return (
    <div ref={billDetailsRef}>
      <div className="mb-6 flex flex-col items-center md:mb-9">
        <Image
          className="m-auto mb-1 h-[60px] w-[60px] md:mb-4 md:h-[180px] md:w-[180px]"
          src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/has_bill.png"
          width={180}
          height={180}
          alt="payment-bill-artwork"
        />

        {paymentAmount && <div className="mb-0.5 text-heading-lg md:mb-3">{paymentAmount}</div>}

        <label className="text-label-md md:text-label-lg">
          {parseBillTitle(paymentRule, bills[0]?.month)}
        </label>
      </div>

      <ul>
        <li className="flex min-h-[56px] items-center justify-between border-b border-dark-50 py-[18px]">
          <label className="text-label-lg text-dark-300">Số điện thoại</label>

          <label className="text-label-lg font-bold">{customerCode}</label>
        </li>

        {telcoCode === TelcoCode.VIETTEL && (
          <li className="flex min-h-[56px] items-center justify-between border-b border-dark-50 py-[18px]">
            <label className="text-label-lg text-dark-300">Kiểm tra cước miễn phí</label>

            <BillCheck />
          </li>
        )}

        <li className="flex min-h-[56px] items-start justify-between border-b border-dark-50 py-[18px]">
          <label className="text-label-lg text-dark-300">Ghi chú</label>

          <ul>
            {bills.map((bill, index) => (
              <li key={bill.ID + index}>
                <label className="text-right text-label-lg">
                  {parseBillDescription(telcoCode, bill.month)}
                </label>
              </li>
            ))}
          </ul>
        </li>

        <li className="flex min-h-[56px] items-center justify-between py-[18px]">
          <label className="text-label-lg text-dark-300">Nhà cung cấp</label>

          <label className="text-label-lg">{TELCO_NAME[telcoCode]}</label>
        </li>
      </ul>
    </div>
  )
}
