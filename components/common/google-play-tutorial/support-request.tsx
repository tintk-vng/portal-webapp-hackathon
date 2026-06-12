'use client'

import { AppID, EVENT } from '@/constants/telco'
import commonUtil from '@/utils/common'
import styles from './styles.module.scss'

export function SupportRequest() {
  const handleSupportClick = () => {
    commonUtil.trackEvent({ ID: EVENT[AppID.GOOGLEPLAY].CLICK_SUPPORT })
    window.open(
      process.env.NEXT_PUBLIC_ZLP_SUPPORT_URL + '/customer/gateway?source=payment-gateway',
      '_blank'
    )
  }

  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-lg bg-other-background px-4 py-3"
      onClick={handleSupportClick}
    >
      <div className="flex items-center">
        <span className={styles.supportIcon} />
        Yêu cầu hỗ trợ
      </div>

      <span className={styles.arrowNextIcon} />
    </div>
  )
}
