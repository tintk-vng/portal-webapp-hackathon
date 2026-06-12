'use client'

import StaticImage from '@/components/common/static-image'
import { cpsImageUrlWithPath } from '@/utils/bill'

export default function SupplierHeaderLogo() {
  return (
    <StaticImage
      src={cpsImageUrlWithPath('logo/EVN.png')}
      width={36}
      height={36}
      className="h-9 w-9 md:h-[60px] md:w-[60px]"
      loader={({ src }) => src}
      alt="tra-cuu-tien-dien-online"
    />
  )
}
