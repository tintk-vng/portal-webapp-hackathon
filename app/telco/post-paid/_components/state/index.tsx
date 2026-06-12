import SkeletonStateView from '@/components/common/state-view/skeleton-state-view'
import { TelcoCode } from '@/constants/telco'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import EmptyPhoneNumberState from './empty-phone-number-state'

const EmptyBillState = dynamic(() => import('./empty-bill-state'), {
  loading: () => <SkeletonStateView />,
})
const MaintenanceState = dynamic(() => import('./maintenance-state'), {
  loading: () => <SkeletonStateView />,
})
const UnsupportedState = dynamic(() => import('./unsupported-state'), {
  loading: () => <SkeletonStateView />,
})

export enum StateType {
  EMPTY_BILL = 'EMPTY_BILL',
  EMPTY_PHONE_NUMBER = 'EMPTY_PHONE_NUMBER',
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
  const stateRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (type !== StateType.EMPTY_PHONE_NUMBER) {
      stateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }
  }, [type])

  return (
    <div ref={stateRef} className="mb-6">
      {(() => {
        switch (type) {
          case StateType.EMPTY_BILL:
            return <EmptyBillState onButtonClick={extraInfo?.onButtonClick} />
          case StateType.EMPTY_PHONE_NUMBER:
            return <EmptyPhoneNumberState />
          case StateType.UNSUPPORTED:
            return <UnsupportedState />
          case StateType.MAINTENANCE:
            return <MaintenanceState telcoCode={extraInfo?.telcoCode || TelcoCode.INVALID} />
          default:
            return null
        }
      })()}
    </div>
  )
}
