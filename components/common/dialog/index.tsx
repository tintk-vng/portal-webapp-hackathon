import useOutsideClick from '@/hooks/use-outside-click'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Button, { ButtonSize, ButtonType } from '../button'

export interface DialogState {
  visible: boolean
  title?: string
  description?: string
  primaryCTAText?: string
  onPrimaryCTAClick?: () => void
  secondaryCTAText?: string
  onSecondaryCTAClick?: () => void
}

export interface DialogProps extends DialogState {
  onClose: () => void
}

export default function Dialog({
  visible,
  title = 'Thông báo',
  description,
  primaryCTAText = 'Đóng',
  onPrimaryCTAClick,
  secondaryCTAText,
  onSecondaryCTAClick,
  onClose,
}: DialogProps) {
  const dialogRef = useRef(null)
  const [dialogClassName, setDialogClassName] = useState({
    overlay: 'opacity-0',
    container: '',
  })

  useEffect(() => {
    if (visible) {
      setDialogClassName({
        overlay: 'opacity-100',
        container: 'animate-appearance-in',
      })
    }
  }, [visible])

  const handleClose = () => {
    setDialogClassName({
      overlay: 'opacity-0',
      container: 'animate-appearance-out',
    })
    setTimeout(() => {
      onClose()
    }, 500)
  }

  useOutsideClick(dialogRef, handleClose)

  if (!visible) {
    return null
  }

  const handlePrimaryCTAClick = () => {
    onPrimaryCTAClick?.()
    onClose()
  }

  return ReactDOM.createPortal(
    <div
      className={classNames({
        'fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-other-overlay transition duration-300':
          true,
        [dialogClassName.overlay]: true,
      })}
    >
      <div
        ref={dialogRef}
        className={classNames({
          'absolute w-[270px] rounded-xl bg-white-500 transition duration-300': true,
          [dialogClassName.container]: true,
        })}
      >
        <div className="border-b border-other-stroke p-4 pt-[20px]">
          <div className="mb-2 text-center text-label-lg font-bold">{title}</div>

          <div className="text-center text-label-md">{description}</div>
        </div>

        <div className="flex h-12">
          <Button
            width="w-full"
            size={ButtonSize.LARGE}
            type={ButtonType.TEXT_LINK}
            onClick={handlePrimaryCTAClick}
          >
            {primaryCTAText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
