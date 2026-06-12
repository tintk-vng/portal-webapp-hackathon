'use client'
import { ButtonType } from '@/components/common/button'
import StateView from '@/components/common/state-view'
import MaintenanceArtwork from '@/public/images/artworks/maintenance.svg'

interface IMaintenanceState {
  title: string
  description: string
  className: string
  buttonText: string
  buttonType: ButtonType
  onButtonClick: Function
}

export default function MaintenanceState({
  title = 'Dịch vụ đang bảo trì',
  description = 'Nhằm cải thiện chất lượng, quá trình bảo trì có thể diễn ra trong vài giờ. Thử lại sau bạn nhé.',
  className = '',
  buttonText = 'Về trang chủ',
  buttonType = ButtonType.PRIMARY,
  onButtonClick,
}: Partial<IMaintenanceState>) {
  function onClick() {
    onButtonClick && onButtonClick()
  }

  return (
    <>
      <StateView
        className={className}
        artworkSrc={MaintenanceArtwork}
        title={title}
        description={description}
        buttonText={buttonText}
        buttonType={buttonType}
        onButtonClick={onClick}
      />
    </>
  )
}
