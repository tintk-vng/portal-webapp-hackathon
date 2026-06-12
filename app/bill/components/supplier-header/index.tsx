'use client'

import Image from '@/components/common/image'
import { Supplier } from '@/types/bill'
import { cpsImageUrlWithPath } from '@/utils/bill'
import arrowBack from '../../../../public/images/icons/arrow-left.svg'
interface SupplierHeaderProps {
  title?: string
  supplier: Supplier
  alt: string
  usingSvg?: boolean
  onBack?: () => void
}

export default function SupplierHeader({
  title,
  supplier,
  alt,
  usingSvg = false,
  onBack = undefined,
}: SupplierHeaderProps) {
  return (
    <div className="mb-4">
      {onBack && (
        <div onClick={onBack} className="absolute left-[20px]">
          <Image src={arrowBack} alt="" />
        </div>
      )}
      {title && <div className="mb-4 text-xl font-bold md:mb-6 md:text-heading-lg">{title}</div>}
      <div className="flex items-center rounded-lg p-5 shadow-[0_2px_12px] shadow-[rgba(0,31,62,0.05)]">
        <Image
          src={cpsImageUrlWithPath(
            `logo/${!usingSvg ? `${supplier.icon}.png` : `${supplier.icon}_v2.svg`}`
          )}
          width={36}
          height={36}
          className="h-9 w-9 object-contain md:h-[60px] md:w-[60px]"
          loader={({ src }) => src}
          alt={alt}
        />

        <label className="mx-2 text-xl font-medium">{supplier.name}</label>
      </div>
    </div>
  )
}
