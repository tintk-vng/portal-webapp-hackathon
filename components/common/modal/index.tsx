import useOutsideClick from '@/hooks/use-outside-click'
import classNames from 'classnames'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Button, { ButtonSize, ButtonType } from '../button'
import styles from './styles.module.scss'

export interface ModalProps {
  visible: boolean
  children: ReactNode
  className?: string
  size?: 'sm' | 'md'
  title?: string
  rightIcon?: ReactNode
  primaryCTAText: string
  onPrimaryCTAClick: () => void
  secondaryCTAText?: string
  onSecondaryCTAClick?: () => void
  onClose: () => void
}

export default function Modal({
  visible,
  children,
  className = '',
  size = 'md',
  title,
  rightIcon,
  primaryCTAText,
  onPrimaryCTAClick,
  secondaryCTAText,
  onSecondaryCTAClick,
  onClose,
}: ModalProps) {
  const modalRef = useRef(null)
  const [modalClassName, setModalClassName] = useState({
    overlay: 'opacity-0',
    container: '',
  })

  useEffect(() => {
    if (visible) {
      setModalClassName({
        overlay: 'opacity-100',
        container: 'animate-appearance-in',
      })
    }
  }, [visible])

  const handleClose = () => {
    setModalClassName({
      overlay: 'opacity-0',
      container: 'animate-appearance-out',
    })
    setTimeout(() => {
      onClose()
    }, 300)
  }

  useOutsideClick(modalRef, handleClose)

  return ReactDOM.createPortal(
    <div
      className={classNames({
        'fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-other-overlay transition-opacity duration-300':
          true,
        [modalClassName.overlay]: true,
        [className]: !!className,
      })}
    >
      <div
        className={classNames({
          'relative rounded-lg bg-white-500': true,
          'w-[400px]': size === 'sm',
          'w-[550px]': size === 'md',
          [modalClassName.container]: true,
        })}
        ref={modalRef}
      >
        <div
          className={classNames({
            'flex items-center justify-start border-b border-other-stroke px-8 py-6': true,
            'border-b-0 pb-0': !title,
          })}
        >
          {title && <div className="text-heading-lg">{title}</div>}

          <div className="absolute right-6 top-6 flex items-center">
            {rightIcon || <span className={styles.closeIcon} onClick={onClose} />}
          </div>
        </div>

        <div className="p-8">{children}</div>

        <div className="flex space-x-3 px-8 pb-6">
          {secondaryCTAText && (
            <Button
              width="w-full"
              type={ButtonType.SECONDARY}
              size={ButtonSize.LARGE}
              bold={false}
              onClick={onSecondaryCTAClick}
            >
              {secondaryCTAText}
            </Button>
          )}

          <Button width="w-full" size={ButtonSize.LARGE} onClick={onPrimaryCTAClick}>
            {primaryCTAText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
