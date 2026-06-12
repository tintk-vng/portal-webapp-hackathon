'use client'

import SkeletonStateView from '@/components/common/state-view/skeleton-state-view'
import { TelcoCode } from '@/constants/telco'
import dynamic from 'next/dynamic'

const EmptyPackageState = dynamic(() => import('./empty-package-state'), {
  loading: () => <SkeletonStateView />,
})
const UnsupportedState = dynamic(() => import('./unsupported-state'), {
  loading: () => <SkeletonStateView />,
})
const MaintenanceState = dynamic(() => import('./maintenance-state'), {
  loading: () => <SkeletonStateView />,
})

export enum StateType {
  EMPTY_PACKAGE = 'EMPTY_PACKAGE',
  UNSUPPORTED = 'UNSUPPORTED',
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
  const telcoCode = extraInfo?.telcoCode || TelcoCode.INVALID

  return (
    <div className="mb-6">
      {(() => {
        switch (type) {
          case StateType.EMPTY_PACKAGE:
            return <EmptyPackageState telcoCode={telcoCode} />
          case StateType.UNSUPPORTED:
            return <UnsupportedState telcoCode={telcoCode} />
          case StateType.MAINTENANCE:
            return <MaintenanceState telcoCode={telcoCode} />
          default:
            return null
        }
      })()}
    </div>
  )
}
