'use client'

import SkeletonStateView from '@/components/common/state-view/skeleton-state-view'
import dynamic from 'next/dynamic'

const MaintenanceState = dynamic(() => import('./maintenance-state'), {
  loading: () => <SkeletonStateView />,
})

export enum StateType {
  MAINTENANCE = 'MAINTENANCE',
}

interface StateProps {
  type: StateType
}

export default function State({ type }: StateProps) {
  return (
    <div className="mb-6">
      {(() => {
        switch (type) {
          case StateType.MAINTENANCE:
            return <MaintenanceState />
          default:
            return null
        }
      })()}
    </div>
  )
}
