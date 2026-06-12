'use client'

import { ButtonType } from '@/components/common/button'
import StateView from '@/components/common/state-view'

interface EmptyBillStateProps {
  onButtonClick?: () => void
}

export default function EmptyBillState({ onButtonClick }: EmptyBillStateProps) {
  return (
    <StateView
      artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/has_bill.png"
      title="Chưa tới kỳ thanh toán mới"
      description="Số điện thoại đã được thanh toán và chưa đến kỳ thanh toán tiếp theo, vui lòng quay lại sau."
      buttonText="Thanh toán số điện thoại khác"
      buttonType={ButtonType.SECONDARY}
      onButtonClick={onButtonClick}
    />
  )
}
