import useOutsideClick from '@/hooks/use-outside-click'
import classNames from 'classnames'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Button, { ButtonSize, ButtonType } from '../button'
import styles from './styles.module.scss'

export interface BottomSheetProps {
  visible: boolean
  children: ReactNode
  className?: string
  title?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  primaryCTAText?: string
  onPrimaryCTAClick?: () => void
  secondaryCTAText?: string
  onSecondaryCTAClick?: () => void
  onClose: () => void
}

export default function BottomSheet({
  visible,
  children,
  className = '',
  title,
  leftIcon,
  rightIcon,
  primaryCTAText,
  onPrimaryCTAClick,
  secondaryCTAText,
  onSecondaryCTAClick,
  onClose,
}: BottomSheetProps) {
  const [bottomSheetClassName, setBottomSheetClassName] = useState({
    overlay: 'opacity-0',
    container: 'translate-y-full md:translate-x-full md:translate-y-0',
  })
  const bottomSheetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (visible) {
      setBottomSheetClassName({
        overlay: 'opacity-100',
        container: 'translate-y-0 md:translate-x-0 md:translate-y-0',
      })
    }
  }, [visible])

  const handleClose = () => {
    setBottomSheetClassName({
      overlay: 'opacity-0',
      container: 'translate-y-full md:translate-x-full md:translate-y-0',
    })
    setTimeout(() => {
      onClose()
    }, 500)
  }

  useOutsideClick(bottomSheetRef, handleClose)

  if (!visible) {
    return null
  }

  return ReactDOM.createPortal(
    <div
      className={classNames({
        'fixed bottom-0 left-0 right-0 top-0 z-50': true,
        [className]: !!className,
      })}
    >
      <div
        className={classNames({
          'h-full w-full bg-other-overlay transition-opacity duration-500': true,
          [bottomSheetClassName.overlay]: true,
        })}
      />

      <div
        className={classNames({
          'absolute bottom-0 w-full rounded-t-lg bg-white-500 transition-transform duration-500 md:right-0 md:max-w-[400px] md:rounded-t-none':
            true,
          [bottomSheetClassName.container]: true,
        })}
        ref={bottomSheetRef}
      >
        <div
          className={classNames({
            'flex h-12 items-center justify-center': true,
            'h-10': !title,
          })}
        >
          <div className="absolute left-3.5 flex items-center">{leftIcon}</div>

          {title && <label className="text-label-lg font-bold">{title}</label>}

          <div className="absolute right-3.5 flex items-center">
            {rightIcon || <span className={styles.closeIcon} onClick={handleClose} />}
          </div>
        </div>

        <div
          className={classNames({
            'max-h-[calc(100vh-72px)] min-h-[300px] overflow-auto p-4 md:h-[calc(100vh-48px)] md:max-h-full':
              true,
            'pb-20': !!primaryCTAText,
          })}
        >
          {children}
        </div>

        {primaryCTAText && (
          <div className="absolute bottom-0 left-0 right-0 flex space-x-2 bg-white-500 p-4">
            {secondaryCTAText && (
              <Button
                width="w-1/2"
                type={ButtonType.SECONDARY}
                size={ButtonSize.LARGE}
                bold={false}
                onClick={onSecondaryCTAClick}
              >
                {secondaryCTAText}
              </Button>
            )}

            <Button
              width={secondaryCTAText ? 'w-1/2' : 'w-full'}
              size={ButtonSize.LARGE}
              onClick={onPrimaryCTAClick}
            >
              {primaryCTAText}
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
