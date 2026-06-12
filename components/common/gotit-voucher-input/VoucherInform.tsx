import Image from '../image'
import Inform, { InformType } from '../inform'

export default function VoucherInform() {
  return (
    <Inform type={InformType.WARNING}>
      <div className="flex items-center justify-center space-x-2">
        <Image
          className="h-6 w-6"
          src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/gotit.svg"
          alt="supplier-logo"
        />

        <label className="text-label-md">
          Bạn đang có voucher Got It và sẽ được áp dụng tại bước thanh toán
        </label>
      </div>
    </Inform>
  )
}
