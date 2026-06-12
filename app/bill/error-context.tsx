'use client'
import { AppID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import { RespStatus } from '@/utils/bill'
import dynamic from 'next/dynamic'
import { ReactNode, createContext, useState } from 'react'
import ErrorState from './components/error'
import MaintenanceState from './components/mantaince'
const Dialog = dynamic(() => import('@/components/common/dialog'))

interface HandleErrorMoreOpt {
  showDialog?: boolean
}

// Initiate Context
const ErrorContext = createContext({
  appID: 0 as AppID,
  handleError: (newError: any, moreOpt?: HandleErrorMoreOpt) => {
    /** Do nothing */
  },
})
const initialDialogValue = {
  title: '',
  description: '',
  primaryCTAText: '',
  onPrimaryCTAClick: () => {},
}
// Provide Context
export const ErrorProvider = ({ appID, children }: { appID: AppID; children: ReactNode }) => {
  const [error, setError] = useState<any>()
  const [dialogVisible, setDialogVisible] = useState(false)
  const [dialogValue, setDialogValue] = useState<{
    title: string
    description: string
    primaryCTAText: string
    onPrimaryCTAClick: () => void
  }>(initialDialogValue)

  function handleError(newError: any, moreOpt: HandleErrorMoreOpt = {}) {
    const { showDialog = true } = moreOpt
    if (newError?.response?.status < 500 && showDialog) {
      const { error } = newError?.response?.data
      setDialogVisible(true)
      setDialogValue({
        title: error?.message || '',
        description: error?.detail?.description || '',
        primaryCTAText: 'Đóng',
        onPrimaryCTAClick: onCloseDialog,
      })
    } else {
      setError(newError)
    }
  }

  function onGoToHomePage() {
    const url = MAPPED_PATH[Domain.BILL][appID]?.source ?? '/'
    location.replace(url)
  }

  function onErrorReload() {
    onGoToHomePage()
  }

  function onCloseDialog() {
    setDialogVisible(false)
    setDialogValue(initialDialogValue)
  }

  if (error) {
    const stateClasses = '-mx-4 md:mx-0 md:shadow-[0_2px_12px_0] md:shadow-dark-500/5 md:rounded-lg'
    if (error.response?.status === RespStatus.Maintain) {
      return (
        <MaintenanceState
          title={error.response?.data?.error?.message}
          description={error.response?.data?.error?.detail?.description}
          className={stateClasses}
          buttonText="Về trang chủ"
          onButtonClick={onGoToHomePage}
        />
      )
    }
    return (
      <ErrorState
        title={error.response?.data?.error?.message}
        description={error.response?.data?.error?.detail?.description}
        className={stateClasses}
        onButtonClick={onErrorReload}
      />
    )
  }

  return (
    <ErrorContext.Provider value={{ appID, handleError }}>
      {children}
      {dialogVisible && <Dialog visible onClose={onCloseDialog} {...dialogValue} />}
    </ErrorContext.Provider>
  )
}

export default ErrorContext
