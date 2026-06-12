import Image from '@/components/common/image'
import { cpsImageUrlWithPath, imageLoader } from '@/utils/bill'

export default function SupplierCard({ supplier }: { supplier: { icon: string; name: string } }) {
  return (
    <div className="flex w-full items-center gap-x-3 rounded-lg bg-white-500 p-4 text-label-lg shadow-[0_2px_12px_0] shadow-dark-500/5">
      <Image
        src={cpsImageUrlWithPath(`logo/${supplier.icon}.png`)}
        className="h-[36px] w-[36px] md:h-[60px] md:w-[60px]"
        width={0}
        height={0}
        alt={supplier.icon}
        loader={imageLoader}
      />
      <label className="text-label-lg md:text-xl md:font-medium">{supplier.name}</label>
    </div>
  )
}
