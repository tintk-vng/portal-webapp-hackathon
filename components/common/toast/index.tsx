import classNames from 'classnames'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Image from '../image'

let timer: ReturnType<typeof setTimeout>

interface ToastProps {
  iconURL: string
  visible: boolean
  message: string
  onClose: () => void
}

export default function Toast({ iconURL, visible, message, onClose }: ToastProps) {
  const [toastClassName, setToastClassName] = useState('')

  useEffect(() => {
    if (visible) {
      setToastClassName('animate-appearance-in')
    }
  }, [visible])

  const handleClose = () => {
    setToastClassName('animate-appearance-out')
    setTimeout(() => {
      onClose()
    }, 500)
  }

  useEffect(() => {
    timer = setTimeout(() => {
      handleClose()
    }, 2000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (!visible) {
    return null
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div
        className={classNames({
          'flex min-h-[90px] w-[184px] flex-col items-center justify-center rounded-lg bg-[rgba(0,31,62,0.8)] p-4 pt-3':
            true,
          [toastClassName]: true,
        })}
      >
        {iconURL ? (
          <Image src={iconURL} width={24} height={24} alt="toast-icon" />
        ) : (
          <span className="h-12 w-12 min-w-12 cursor-pointer bg-[url('https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/circle_check.svg')] bg-contain bg-no-repeat" />
        )}

        <label className="mt-3 text-center text-label-md text-white-500">{message}</label>
      </div>
    </div>,
    document.body
  )
}
