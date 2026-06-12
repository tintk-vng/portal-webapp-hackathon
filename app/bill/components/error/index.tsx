'use client'

import { ButtonType } from '@/components/common/button'
import StateView from '@/components/common/state-view'
import ErrorSystemArtwork from '@/public/images/artworks/error_system.svg'
import { useRouter } from 'next/navigation'

interface ErrorStateProps {
  className?: string
  title: string
  description: string
  buttonText?: string
  buttonType?: ButtonType
  onButtonClick?: Function
}

export default function ErrorState({
  className = '',
  title = 'Có sự cố xảy ra. Vui lòng thử lại sau.',
  description = 'Xin lỗi vì sự bất tiện này, vui lòng quay lại sau hoặc trải nghiệm các dịch vụ khác để thay thế.',
  buttonText = 'Thử lại',
  buttonType = ButtonType.SECONDARY,
  onButtonClick,
}: ErrorStateProps) {
  const router = useRouter()

  const onClick = () => {
    onButtonClick ? onButtonClick() : router.refresh()
  }

  return (
    <StateView
      className={className}
      artworkSrc={ErrorSystemArtwork}
      title={title}
      description={description}
      buttonText={buttonText}
      buttonType={buttonType}
      onButtonClick={onClick}
    />
  )
}
