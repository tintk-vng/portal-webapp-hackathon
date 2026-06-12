import { BillType } from '@/constants/bill'
import useToggle from '@/hooks/use-toggle'
import { IBillInfo } from '@/types/bill'
import { getDisanceBetweenTimestamp } from '@/utils/bill'
import commonUtil from '@/utils/common'
import Image from 'next/image'
import ComsumptionInfoBottomSheet from './consumtion-info-bottom-sheet'

interface DebtInfoProps {
  billInfo: IBillInfo | null
}

export default function DebtInfo({ billInfo }: DebtInfoProps) {
  const [visible, toggle] = useToggle()

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

  const paymentAmount = commonUtil.formatCurrency(billInfo?.bills[0].amount || 0)

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
              {billInfo?.bills[0].bill_type === BillType.DEBT
                ? `Kỳ thanh toán ${billInfo?.bills[0].month_string}`
                : billInfo?.bills[0].description}
            </label>

            {billInfo?.bills[0].meter_index && (
              <span
                className="h-4 w-4 cursor-pointer bg-[url('../public/images/icons/primary_info.svg')] bg-contain bg-no-repeat"
                onClick={toggle}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center text-center text-label-md text-dark-300 md:text-xl">
        Cập nhật từ nhà cung cấp {getDisanceBetweenTimestamp(billInfo?.updateAt || 0)}
      </div>

      <ComsumptionInfoBottomSheet
        visible={visible}
        onClose={toggle}
        fields={[
          {
            label: 'Chỉ số đầu kì',
            value: billInfo?.bills[0].meter_index?.new_index || 0,
          },
          {
            label: 'Chỉ số đầu kì',
            value: billInfo?.bills[0].meter_index?.old_index || 0,
          },
          {
            label: 'Tổng tiêu thụ',
            value: billInfo?.bills[0].meter_index?.usage || 0,
          },
        ]}
      />
    </div>
  )
}
