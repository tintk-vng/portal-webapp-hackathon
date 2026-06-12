import { AppID as BillAppID } from '@/constants/bill'
import { AppID as TelcoAppID, EVENT as TELCO_EVENT } from '@/constants/telco'
import commonUtil from '@/utils/common'
import { useEffect } from 'react'

interface useLoadPageEventTrackingProps {
  appID: TelcoAppID | BillAppID
}

export const useLoadPageEventTracking = ({ appID }: useLoadPageEventTrackingProps) => {
  useEffect(() => {
    if (appID in TelcoAppID) {
      commonUtil.trackEvent({ ID: TELCO_EVENT[appID as TelcoAppID].LOAD_PAGE })
    } else {
      // commonUtil.trackEvent({ ID: TELCO_EVENT[appID as TelcoAppID].LOAD_PAGE })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
