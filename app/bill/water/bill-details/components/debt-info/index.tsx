import { PaymentType } from '@/constants/bill'
import PaymentBillArtwork from '@/public/images/artworks/payment_bill.svg'
import { IBill, IBillInfo } from '@/types/bill'
import { getDisanceBetweenTimestamp } from '@/utils/bill'
import commonUtil from '@/utils/common'
import Image from 'next/image'

const getBillingCycle = (billInfo: IBillInfo) => {
  let billingCycle = ''
  if (
    billInfo.paymentRule === PaymentType.PayAll ||
    billInfo.paymentRule === PaymentType.PayBySelectedPeriod
  ) {
    billInfo.bills.map((bill: IBill, index: number) => {
      if (index !== billInfo.bills.length - 1) {
        billingCycle += bill.month_string.slice(0, 2) + ', '
      } else {
        billingCycle += bill.month_string
      }
      return bill
    })
  } else {
    billingCycle = billInfo.bills[0].month_string
  }
  return billingCycle
}

interface DebtInfoProps {
  billInfo: IBillInfo
}

export default function DebtInfo({ billInfo }: DebtInfoProps) {
  if (commonUtil.isEmpty(billInfo)) {
    return null
  }

  if (commonUtil.isEmpty(billInfo?.bills)) {
    return (
      <div className="mb-6 mt-9 md:mb-9">
        <div className="mb-2 flex flex-col items-center md:mb-3">
          <Image
            className="m-auto mb-1 h-[60px] w-[60px] md:mb-4 md:h-[180px] md:w-[180px]"
            src={'https://scdn.zalopay.com.vn/zst/zpi/images/bill/portal/artworks/payment_bill.svg'}
            width={180}
            height={180}
            alt="payment-bill-artwork"
          />

          <div className="text-heading-lg">Chưa tới kỳ thanh toán</div>
        </div>

        <div className="flex justify-center text-center text-label-md text-dark-300 md:text-xl">
          Bạn có thể chọn thanh toán hoá đơn của các dịch vụ khác bên cạnh nhé.
        </div>
      </div>
    )
  }

  const { paymentRule, totalAmount, bills } = billInfo
  const paymentAmount = commonUtil.formatCurrency(
    paymentRule === PaymentType.PayAll || paymentRule === PaymentType.PayBySelectedPeriod
      ? totalAmount
      : bills[0].amount ?? 0
  )

  return (
    <div className="mb-6 mt-9 md:mb-9">
      <div className="mb-2 flex flex-col items-center md:mb-3">
        <Image
          className="m-auto mb-1 h-[60px] w-[60px] md:mb-4 md:h-[180px] md:w-[180px]"
          src={'https://scdn.zalopay.com.vn/zst/zpi/images/bill/portal/artworks/payment_bill.svg'}
          width={180}
          height={180}
          alt="payment-bill-artwork"
        />

        {paymentAmount && <div className="text-heading-lg">{paymentAmount}</div>}

        {!commonUtil.isEmpty(billInfo?.bills[0]) && (
          <div className="mt-2 flex items-center space-x-1 md:mt-4">
            <label className="text-label-md md:text-lg">
              Kỳ thanh toán {getBillingCycle(billInfo)}
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-center text-center text-label-md text-dark-300 md:text-xl">
        Cập nhật từ nhà cung cấp {getDisanceBetweenTimestamp(billInfo?.updateAt || 0)}
      </div>
    </div>
  )
}
