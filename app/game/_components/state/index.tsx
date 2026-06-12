'use client'

import SkeletonStateView from '@/components/common/state-view/skeleton-state-view'
import dynamic from 'next/dynamic'
import { useFormContext, useWatch } from 'react-hook-form'

const MaintenanceState = dynamic(() => import('./maintenance-state'), {
  loading: () => <SkeletonStateView />,
})

export enum StateType {
  MAINTENANCE = 'MAINTENANCE',
}

export default function State() {
  const { control } = useFormContext()
  const stateType = useWatch({
    control,
    name: 'stateType',
  }) as StateType

  return (
    <div className="mb-6">
      {(() => {
        switch (stateType) {
          case StateType.MAINTENANCE:
            return <MaintenanceState />
          default:
            return null
        }
      })()}
    </div>
  )
}
