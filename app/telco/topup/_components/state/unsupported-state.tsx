'use client'

import StateView from '@/components/common/state-view'

export default function UnsupportedState() {
  return (
    <StateView
      artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks/maintenance.svg"
      title="Dịch vụ chưa hỗ trợ"
      description="Rất tiếc nhà mạng hiện chưa hỗ trợ dịch vụ nạp điện thoại qua Zalopay. Xin lỗi vì sự bất tiện, bạn có thể trải nghiệm các dịch vụ viễn thông khác."
    />
  )
}
