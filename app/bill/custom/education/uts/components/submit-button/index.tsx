'use client'

import Button, { ButtonSize } from '../../../../components/button'
import { DialogState } from '@/components/common/dialog'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const Dialog = dynamic(() => import('@/components/common/dialog'))

const defaultDialogState = {
  visible: false,
  title: '',
  description: '',
  primaryCTAText: '',
  onPrimaryCTAClick: undefined,
}

interface SubmitButtonProps {
  className?: string
  text: string
  onClick: (failureCallback: (state: DialogState) => void) => void
  isActive?: boolean
}

export default function SubmitButton({
  text,
  onClick,
  className,
  isActive = true,
}: SubmitButtonProps) {
  const [dialogState, setDialogState] = useState<DialogState>(defaultDialogState)
  const { visible } = dialogState
  const handleDialogOpen = (state: DialogState) => {
    setDialogState({
      ...state,
      description: state.description || 'Hệ thống tạm thời gián đoạn. Bạn vui lòng thử lại.',
    })
  }

  const handleDialogClose = () => {
    setDialogState(defaultDialogState)
  }

  const handleFailureCallback = (state: DialogState) => {
    handleDialogOpen(state)
  }

  const handleClick = () => {
    onClick(handleFailureCallback)
  }

  return (
    <div className={classNames({ 'md:mt-4': true, [`${className}`]: !!className })}>
      <div className="left-0 right-0 z-10 bg-white-500 md:static md:p-0 md:shadow-none">
        <Button
          themeColor={!isActive ? '' : '#FF8302'}
          isDisabled={!isActive}
          width="w-full"
          size={ButtonSize.LARGE}
          onClick={handleClick}
        >
          {text}
        </Button>
      </div>

      {visible && <Dialog {...dialogState} onClose={handleDialogClose} />}
    </div>
  )
}
