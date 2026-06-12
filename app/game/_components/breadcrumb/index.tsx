'use client'

import StaticImage from '@/components/common/static-image'
import Link from 'next/link'

export default function Breadcrumb() {
  return (
    <nav className="mb-6 flex items-center gap-2 text-label-md">
      <Link href="/" className="text-blue-500 hover:text-blue-500">
        Trang chủ
      </Link>

      <StaticImage
        src="https://scdn.zalopay.com.vn/zst/zpi/images/design-system/icons/Second/general_arrow_next1.svg"
        width={12}
        height={12}
        alt="caret-icon"
      />

      <Link href="/tat-ca-tin-tuc" className="text-blue-500 hover:text-blue-500">
        Tin tức
      </Link>
    </nav>
  )
}
