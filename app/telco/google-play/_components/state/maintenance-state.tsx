'use client'

import StateView from '@/components/common/state-view'
import { AppID, EVENT } from '@/constants/telco'
import commonUtil from '@/utils/common'
import { useEffect } from 'react'

export default function MaintenanceState() {
  useEffect(() => {
    commonUtil.trackEvent({ ID: EVENT[AppID.GOOGLEPLAY].LOAD_MAINTENANCE_PAGE })
  }, [])

  return (
    <StateView
      artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks/maintenance.svg"
      title="Dịch vụ đang bảo trì"
      description="Nhằm cải thiện chất lượng, quá trình bảo trì có thể diễn ra trong vài giờ. Thử lại sau bạn nhé."
    />
  )
}
