import Image from '@/components/common/image'
import { IBillInfo } from '@/types/bill'
import StateView from '@/app/bill/components/state-view'

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
    </div>
  )
}
export default DebtInfo
