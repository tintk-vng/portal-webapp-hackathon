import { DesignSystemIconSize } from '@/constants/common'
import { TrackingEvent } from '@/types/common'
import commonUtil from '@/utils/common'
import classNames from 'classnames'

const spacing = 12

export interface CallToActionProps {
  title: string
  onCTAClick: () => void
  preIconLink?: string
  postIconLink?: string
  event: TrackingEvent
}

export default function CallToAction({
  title,
  onCTAClick,
  preIconLink,
  postIconLink,
  event,
}: CallToActionProps) {
  let minusLength = 0
  if (preIconLink) {
    minusLength += DesignSystemIconSize.ic24 + spacing
  }
  if (postIconLink) {
    minusLength += DesignSystemIconSize.ic24 + spacing
  }

  function handleClick() {
    commonUtil.trackEvent(event)
    onCTAClick?.()
  }

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center rounded-lg bg-other-background p-4 transition active:bg-white-500 active:ring-1 active:ring-blue-500"
      onClick={handleClick}
    >
      {preIconLink && (
        <span
          className={classNames({
            'pre-icon mr-3 h-[24px] w-[24px] rounded bg-cover bg-center bg-no-repeat': true,
          })}
        />
      )}
      <p
        className="text-left text-label-lg"
        style={minusLength > 0 ? { width: `calc(100% - ${minusLength}px)` } : { width: '100%' }}
      >
        {title}
      </p>
      {postIconLink && (
        <span
          className={classNames({
            'post-icon ml-3 h-[24px] w-[24px] rounded bg-cover bg-center bg-no-repeat': true,
          })}
        />
      )}
    </button>
  )
}
