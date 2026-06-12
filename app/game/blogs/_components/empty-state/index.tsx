import StateView from '@/components/common/state-view'

export default function EmptyState() {
  return (
    <StateView
      className="py-12"
      artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/error_system.png"
      title="Có sự cố xảy ra"
      description="Vui lòng thử lại sau."
    />
  )
}
