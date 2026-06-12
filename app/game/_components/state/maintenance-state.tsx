import StateView from '@/components/common/state-view'
import { TELCO_NAME } from '@/constants/telco'
import { DataSupplier } from '@/types/telco'
import { useFormContext, useWatch } from 'react-hook-form'

export default function MaintenanceState() {
  const { control } = useFormContext()
  const selectedSupplier = useWatch({
    control,
    name: 'supplier',
  }) as DataSupplier
  const supplierName = TELCO_NAME[selectedSupplier.telcoCode]

  return (
    <StateView
      artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks/maintenance.svg"
      title={`Nhà cung cấp${supplierName ? ` ${supplierName}` : ''} đang bảo trì`}
      description={`Nhằm cải thiện chất lượng, nhà cung cấp${
        supplierName ? ` ${supplierName}` : ''
      } đang thực hiện bảo trì dịch vụ mua thẻ game trên Zalopay. Bạn vui lòng quay lại sau ít phút nhé.`}
    />
  )
}
