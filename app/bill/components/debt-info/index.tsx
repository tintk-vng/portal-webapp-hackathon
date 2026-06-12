import Image from '@/components/common/image'
import { PaymentType } from '@/constants/bill'
import NotYetDueBillArtwork from '@/public/images/artworks/undue_bill.svg'
import PaymentBillArtwork from '@/public/images/artworks/payment_bill.svg'
import { IBill, IBillInfo } from '@/types/bill'
import { getDisanceBetweenTimestamp } from '@/utils/bill'
import commonUtil from '@/utils/common'
import StateView from '../state-view'

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
  if (billInfo.bills.length === 0) {
    return (
      <StateView
        artworkSrc={
          'https://scdn.zalopay.com.vn/zst/zpi/images/bill/portal/artworks/undue_bill.svg'
        }
      >
        <label className="text-center text-label-lg font-bold md:text-2xl">
          Chưa tới kỳ thanh toán
        </label>
        <label className="text-center text-label-md text-dark-300 md:text-label-lg">
          Bạn có thể chọn thanh toán hoá đơn của các dịch vụ khác bên cạnh nhé.
        </label>
      </StateView>
    )
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
      <div className="flex w-full flex-col items-center gap-y-2 px-4 py-6 md:gap-y-3 md:p-0">
        <label className="text-center text-2xl font-bold md:text-heading-md">
          {commonUtil.formatCurrency(
            billInfo.paymentRule === PaymentType.PayAll ||
              billInfo.paymentRule === PaymentType.PayBySelectedPeriod
              ? billInfo.totalAmount
              : billInfo.bills[0].amount ?? 0
          )}
        </label>
        <label className="text-center text-label-md md:text-xl">
          Kỳ thanh toán {getPeriodString(billInfo)}
        </label>
        <label className="text-center text-label-md text-dark-300 md:text-xl">
          Cập nhật từ nhà cung cấp {getDisanceBetweenTimestamp(billInfo.updateAt || 0)}
        </label>
      </div>
    </div>
  )
}
export default DebtInfo
