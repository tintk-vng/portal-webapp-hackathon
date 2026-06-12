'use client'

import { ButtonType } from '@/components/common/button'
import StateView from '@/components/common/state-view'
import { AppID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import MaintenanceArtwork from '@/public/images/artworks/maintenance.svg'
import { useRouter } from 'next/navigation'
import { ExtraInfo } from '.'

export default function MaintenanceState({ appID, title, description, onButtonClick }: ExtraInfo) {
  const router = useRouter()

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick()
    } else if (appID && appID in AppID) {
      router.push(MAPPED_PATH[Domain.BILL][appID]?.source || '')
    }
  }

  return (
    <StateView
      artworkSrc={MaintenanceArtwork}
      title={title || 'Dịch vụ đang bảo trì'}
      description={
        description ||
        'Nhằm cải thiện chất lượng, quá trình bảo trì có thể diễn ra trong vài giờ. Thử lại sau bạn nhé.'
      }
      buttonText="Về trang chủ"
      buttonType={ButtonType.PRIMARY}
      onButtonClick={handleButtonClick}
    />
  )
}
