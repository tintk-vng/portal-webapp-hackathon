'use client'

import StateView from '@/components/common/state-view'

export default function EmptyPhoneNumberState() {
  return (
    <StateView
      artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks/empty_phone_number.svg"
      title="Bạn chưa nhập số điện thoại"
      description="Vui lòng nhập số điện thoại để kiểm tra cước điện thoại trả sau."
    />
  )
}
