import Breadcrumb from '@/app/game/_components/breadcrumb'
import StateView from '@/components/common/state-view'
import ErrorBoundary from '@/components/layout/error-boundary'

export default function EmptyState() {
  return (
    <ErrorBoundary>
      <Breadcrumb />

      <StateView
        className="py-12"
        artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/error_system.png"
        title="Không tìm thấy bài viết"
        description="Bài viết không tồn tại hoặc đã bị xóa."
      />
    </ErrorBoundary>
  )
}
