import Image from '@/components/common/image'
import { Supplier } from '@/types/bill'
import { getBillDemo } from '../../../logo-mapping'

interface SupplierSelectProps {
  selectedSupplier: Supplier
}

export default function ExampleBill({ selectedSupplier }: SupplierSelectProps) {
  const billDemo = getBillDemo(selectedSupplier.icon, Number(selectedSupplier.ID))

  return (
    <div>
      <div className="mt-4 text-label-lg text-dark-300">Hoá đơn mẫu</div>

      <div className="mt-3 flex max-h-full max-w-full items-center justify-center">
        <Image
          className="h-auto w-full md:h-96 md:w-auto"
          src={billDemo}
          width={0}
          height={0}
          alt="tra-cuu-thanh-toan-phi-chung-cu-online"
          loader={({ src }) => src}
        />
      </div>
    </div>
  )
}
