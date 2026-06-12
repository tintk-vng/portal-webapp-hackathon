'use client'

import SkeletonStateView from '@/components/common/state-view/skeleton-state-view'
import { TelcoCode } from '@/constants/telco'
import dynamic from 'next/dynamic'

const MaintenanceState = dynamic(() => import('./maintenance-state'), {
  loading: () => <SkeletonStateView />,
})

export enum StateType {
  MAINTENANCE = 'MAINTENANCE',
}

interface StateProps {
  type: StateType
  extraInfo?: {
    telcoCode?: TelcoCode
    onButtonClick?: () => void
  }
}

export default function State({ type, extraInfo }: StateProps) {
  return (
    <div className="mb-6">
      {(() => {
        switch (type) {
          case StateType.MAINTENANCE:
            return <MaintenanceState telcoCode={extraInfo?.telcoCode || TelcoCode.INVALID} />
          default:
            return null
        }
      })()}
    </div>
  )
}
