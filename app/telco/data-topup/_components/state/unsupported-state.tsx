'use client'

import StateView from '@/components/common/state-view'
import { TELCO_NAME, TelcoCode } from '@/constants/telco'

interface UnsupportedStateProps {
  telcoCode: TelcoCode
}

export default function UnsupportedState({ telcoCode }: UnsupportedStateProps) {
  const supplierName = TELCO_NAME[telcoCode]

  return (
    <StateView
      artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/unsupported.png"
      title="Zalopay tạm thời chưa hỗ trợ nhà mạng này"
      description={`Rất tiếc nhà mạng ${supplierName} hiện chưa hỗ trợ dịch vụ nạp 3G/4G. Xin lỗi vì sự bất tiện, bạn có thể trải nghiệm các dịch vụ viễn thông khác.`}
    />
  )
}
