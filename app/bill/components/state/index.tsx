import SkeletonStateView from '@/components/common/state-view/skeleton-state-view'
import { AppID } from '@/constants/bill'
import { RespReason, RespStatus } from '@/utils/bill'
import dynamic from 'next/dynamic'

const ErrorState = dynamic(() => import('./error-state'), {
  loading: () => <SkeletonStateView />,
})
const MaintenanceState = dynamic(() => import('./maintenance-state'), {
  loading: () => <SkeletonStateView />,
})

const DownloadZPState = dynamic(() => import('./download-zp-state'), {
  loading: () => <SkeletonStateView />,
})

export enum StateType {
  ERROR_STATE = 'ERROR_STATE',
  MAINTENANCE = 'MAINTENANCE',
  SUGGEST_DOWNLOAD = 'SUGGEST_DOWNLOAD',
}

export interface ExtraInfo {
  appID?: AppID
  title?: string
  description?: string
  deeplink?: string
  onButtonClick?: () => void
}

interface StateProps {
  type: StateType
  extraInfo?: ExtraInfo
}

export default function State({ type, extraInfo }: StateProps) {
  return (
    <div className="mb-6">
      {(() => {
        switch (type) {
          case StateType.ERROR_STATE:
            return <ErrorState {...extraInfo} />
          case StateType.MAINTENANCE:
            return <MaintenanceState {...extraInfo} />
          case StateType.SUGGEST_DOWNLOAD:
            return <DownloadZPState {...extraInfo} />
          default:
            return null
        }
      })()}
    </div>
  )
}

export function mapStateViewByCodeAndReason(code: number, reason: string) {
  return (
    MapStateTypeByCodeAndReason[`${code}_${reason}`] ||
    MapStateTypeByCodeAndReason[code.toString()] ||
    StateType.ERROR_STATE
  )
}

export function mapTitleByCodeAndReason(code: number, reason: string) {
  return MapTitleByCodeAndReason[`${code}_${reason}`] || MapTitleByCodeAndReason[code.toString()] || ''
}

const MapStateTypeByCodeAndReason = {
  [RespStatus.Maintain.toString()]: StateType.MAINTENANCE,
  [`${[RespStatus.Maintain]}_${RespReason.ProviderReachLimitation}`]: StateType.SUGGEST_DOWNLOAD,
}

const MapTitleByCodeAndReason = {
  [`${[RespStatus.Maintain]}_${RespReason.ProviderReachLimitation}`]: 'Quét QR nhận voucher 30K thanh toán hóa đơn',
}
