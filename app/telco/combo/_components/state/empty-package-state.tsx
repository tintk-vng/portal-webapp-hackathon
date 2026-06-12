'use client'

import { ButtonType } from '@/components/common/button'
import StateView from '@/components/common/state-view'
import { Domain, MAPPED_PATH } from '@/constants/common'
import { AppID, TelcoCode } from '@/constants/telco'
import { useRouter } from 'next/navigation'

interface EmptyPackageStateProps {
  telcoCode: TelcoCode
}

export default function EmptyPackageState({ telcoCode }: EmptyPackageStateProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(MAPPED_PATH[Domain.TELCO][AppID.DATA_TOPUP]?.source || '')
  }

  return (
    <StateView
      artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/unsupported.png"
      title="Không có gói Combo nào từ nhà mạng"
      description="Bạn có thể nạp trực tiếp Data 4G/5G để không gặp gián đoạn khi sử dụng"
      buttonText="Nạp Data 4G/5G"
      buttonType={ButtonType.PRIMARY}
      onButtonClick={handleClick}
    />
  )
}
