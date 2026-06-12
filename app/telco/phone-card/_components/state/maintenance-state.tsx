'use client'

import { ButtonType } from '@/components/common/button'
import StateView from '@/components/common/state-view'
import { Domain, MAPPED_PATH } from '@/constants/common'
import { AppID, EVENT, TELCO_NAME, TelcoCode } from '@/constants/telco'
import commonUtil from '@/utils/common'
import { useRouter } from 'next/navigation'

const MAINTENANCE_BUTTON_NAME = 'Nạp điện thoại'

interface MaintenanceStateProps {
  telcoCode: TelcoCode
}

export default function MaintenanceState({ telcoCode }: MaintenanceStateProps) {
  const router = useRouter()
  const supplierName = TELCO_NAME[telcoCode]

  const handleClick = () => {
    commonUtil.trackEvent({
      ID: EVENT[AppID.PHONE_CARD].CLICK_MAINTENANCE_BUTTON,
      metaData: { cta_name: MAINTENANCE_BUTTON_NAME },
    })
    router.push(MAPPED_PATH[Domain.TELCO][AppID.TOPUP]?.source || '')
  }

  return (
    <StateView
      artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks/maintenance.svg"
      title={`${supplierName ? `Nhà mạng ${supplierName}` : 'Các nhà mạng'} đang bảo trì`}
      description={`Nhằm cải thiện chất lượng, ${
        supplierName ? `nhà mạng ${supplierName}` : 'các nhà mạng'
      } đang thực hiện bảo trì dịch vụ mua thẻ điện thoại trên Zalopay. Bạn vui lòng quay lại sau ít phút nhé.`}
      buttonText={MAINTENANCE_BUTTON_NAME}
      buttonType={ButtonType.PRIMARY}
      onButtonClick={handleClick}
    />
  )
}
