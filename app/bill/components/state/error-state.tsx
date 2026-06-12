'use client'

import { ButtonType } from '@/components/common/button'
import StateView from '@/components/common/state-view'
import { AppID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import ErrorSystemArtwork from '@/public/images/artworks/error_system.svg'
import { useRouter } from 'next/navigation'
import { ExtraInfo } from '.'

export default function ErrorState({
  appID,
  title = 'Có sự cố xảy ra. Vui lòng thử lại sau.',
  description = 'Xin lỗi vì sự bất tiện này, vui lòng quay lại sau hoặc trải nghiệm các dịch vụ khác để thay thế.',
  onButtonClick,
}: ExtraInfo) {
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
      artworkSrc={ErrorSystemArtwork}
      title={title}
      description={description}
      buttonText="Thử lại"
      buttonType={ButtonType.SECONDARY}
      onButtonClick={handleButtonClick}
    />
  )
}
