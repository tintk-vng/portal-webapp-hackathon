import Image from '@/components/common/image'
import { SupplierID } from '@/constants/bill'
import { QueryType } from '@/types/bill'
import { useFormContext } from 'react-hook-form'
import { getBillDemo } from '../../../logo-mapping'

export const isExampleBillHide = (supplierID: number) => {
  const blackListIDs = [SupplierID.QUANG_ICH, SupplierID.VN_EDU, SupplierID.RT_HOLDINGS]
  return blackListIDs.includes(supplierID)
}

interface SupplierSelectProps {
  selectedQueryType: QueryType
}

export default function ExampleBill({ selectedQueryType }: SupplierSelectProps) {
  const { getValues } = useFormContext()
  const selectedSupplier = getValues('supplier')

  if (
    selectedSupplier.ID === 0 ||
    isExampleBillHide(selectedQueryType.supplierID || selectedSupplier.ID)
  ) {
    return null
  }

  return (
    <div>
      <div className="mt-4 text-label-lg text-dark-300">Hoá đơn mẫu</div>

      <div className="mt-3 flex max-h-full max-w-full items-center justify-center">
        <Image
          className="h-auto w-full md:h-96 md:w-auto"
          src={getBillDemo(selectedQueryType.sampleBillUrl)}
          width={0}
          height={0}
          alt="tra-cuu-thanh-toan-phi-chung-cu-online"
          loader={({ src }) => src}
        />
      </div>
    </div>
  )
}
