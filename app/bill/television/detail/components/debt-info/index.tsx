import Image from '@/components/common/image'
import { PaymentType } from '@/constants/bill'
import NotYetDueBillArtwork from '@/public/images/artworks/undue_bill.svg'
import PaymentBillArtwork from '@/public/images/artworks/payment_bill.svg'
import { IBill, IBillInfo } from '@/types/bill'
import { getDisanceBetweenTimestamp } from '@/utils/bill'
import commonUtil from '@/utils/common'

function getPeriodString(billInfo: IBillInfo) {
  let monthString = ''
  if (
    billInfo.paymentRule === PaymentType.PayAll ||
    billInfo.paymentRule === PaymentType.PayBySelectedPeriod
  ) {
    billInfo.bills.map((bill: IBill, index: number) => {
      if (index !== billInfo.bills.length - 1) {
        monthString += bill.month_string.slice(0, 2) + ','
      } else {
        monthString += bill.month_string
      }
      return bill
    })
  } else {
    monthString = billInfo.bills[0].month_string
  }
  return monthString
}

interface IDebtInfo {
  billInfo: IBillInfo
}
const DebtInfo = ({ billInfo }: IDebtInfo) => {
  const getAmountInfo = () => {
    switch (billInfo.paymentRule) {
      case PaymentType.PayAll:
        return billInfo.totalAmount
      case PaymentType.PayBySelectedPeriod:
        let amount = 0
        billInfo.bills.map((bill: IBill) => {
          amount += bill.amount
          return bill
        })
        return amount
      default:
        return billInfo.bills[0].amount
    }
  }
  return (
    <div className="flex flex-col items-center pt-6 md:gap-4 md:py-3">
      <Image
        src={'https://scdn.zalopay.com.vn/zst/zpi/images/bill/portal/artworks/payment_bill.svg'}
        width={180}
        height={180}
        alt="payment-bill-artwork"
        className="h-[120px] w-[120px] md:h-[180px] md:w-[180px]"
      />
      <div className="flex w-full flex-col items-center gap-y-2 px-4 pb-2 pt-6 md:gap-y-3 md:p-0">
        <label className="text-center text-2xl font-bold md:text-heading-md">
          {commonUtil.formatCurrency(getAmountInfo())}
        </label>
        {billInfo.bills.length > 0 && (
          <label className="text-center text-label-md md:text-xl">
            Kỳ thanh toán {getPeriodString(billInfo)}
          </label>
        )}
      </div>
    </div>
  )
}
export default DebtInfo
