'use client'

import useOutsideClick from '@/hooks/use-outside-click'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Button, { ButtonType } from '../button'
import Image from '../image'
import styles from './styles.module.scss'

export interface PopupProps {
  visible: boolean
  className?: string
  // size?: 'sm' | 'md'
  imgSrc: string
  title: string
  description: string
  primaryCTAText: string
  onPrimaryCTAClick: () => void
  secondaryCTAText?: string
  onSecondaryCTAClick?: () => void
  onClose: () => void
}

export default function Popup({
  visible,
  className = '',
  imgSrc,
  title,
  description,
  primaryCTAText,
  onPrimaryCTAClick,
  secondaryCTAText,
  onSecondaryCTAClick,
  onClose,
}: PopupProps) {
  const popupRef = useRef(null)

  const [modalClassName, setPopupClassName] = useState({
    overlay: 'opacity-0',
    container: '',
  })

  useEffect(() => {
    if (visible) {
      setPopupClassName({
        overlay: 'opacity-100',
        container: 'animate-appearance-in',
      })
    }
  }, [visible])

  const handleClose = () => {
    setPopupClassName({
      overlay: 'opacity-0',
      container: 'animate-appearance-out',
    })
    setTimeout(() => {
      onClose()
    }, 300)
  }

  useOutsideClick(popupRef, handleClose)

  return ReactDOM.createPortal(
    <div
      className={classNames({
        'fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-other-overlay p-6 transition-opacity duration-300':
          true,
        [modalClassName.overlay]: true,
        [className]: !!className,
      })}
    >
      <div
        className={classNames({
          'relative max-w-[550px] overflow-hidden rounded-lg bg-white-500': true,
          [modalClassName.container]: true,
        })}
        ref={popupRef}
      >
        <Image
          className="h-auto w-full"
          src={imgSrc}
          width={1}
          height={1}
          priority
          alt="popup-image"
        />

        <span className={styles.closeIcon} onClick={onClose} />

        <div
          className={classNames({
            'jutify-center flex flex-col items-center p-3 md:p-7': true,
            [className]: className,
          })}
        >
          <div className="text-center text-label-lg font-bold md:text-2xl">{title}</div>

          <div className="mt-2 whitespace-break-spaces text-center text-label-md text-dark-400 md:mt-4 md:text-base/[20px]">
            {description}
          </div>

          {primaryCTAText && (
            <Button
              width="mt-6 w-[280px] md:h-[44px] md:w-full w-full"
              type={ButtonType.PRIMARY}
              bold
              onClick={onPrimaryCTAClick}
            >
              {primaryCTAText}
            </Button>
          )}

          {secondaryCTAText && (
            <Button
              width="w-full mt-2 w-[280px] h-10 md:h-[44px]"
              type={ButtonType.TEXT_LINK}
              bold
              onClick={onSecondaryCTAClick}
            >
              {secondaryCTAText}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
