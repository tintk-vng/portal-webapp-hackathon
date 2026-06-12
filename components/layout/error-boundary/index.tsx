import { AppID as BillAppID } from '@/constants/bill'
import { AppID as TelcoAppID, EVENT as TELCO_EVENT } from '@/constants/telco'
import commonUtil from '@/utils/common'
import Script from 'next/script'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  appID?: TelcoAppID | BillAppID
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Failed to load component: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return null
    }

    return (
      <div>
        <Script
          src="https://sjs.zalopay.com.vn/zst/zpi-spa/sdk-tracking/0.20.1/client/tracking.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENV !== 'local') {
              window.ZPI_TRACKING_SDK.createSession(process.env.NEXT_PUBLIC_ENV, '0.0.1')
              window.ZPI_TRACKING_SDK.logAccess()
              const { appID } = this.props
              if (!appID) {
                // commonUtil.trackEvent({ ID: EVENT.RESULT_PAGE.LOAD_PAGE })
              } else if (appID in TelcoAppID) {
                commonUtil.trackEvent({ ID: TELCO_EVENT[appID as TelcoAppID].LOAD_PAGE })
              } else if (appID in BillAppID) {
                // commonUtil.trackEvent(EVENT[appID as BillAppID].LOAD_PAGE)
              }
            }
          }}
        />

        {this.props.children}
      </div>
    )
  }
}
