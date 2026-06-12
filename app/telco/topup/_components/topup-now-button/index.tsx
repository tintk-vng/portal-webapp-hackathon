import PaymentButton from '@/components/common/payment-button'
import { AppID } from '@/constants/telco'
import dynamic from 'next/dynamic'
import { Suspense, useContext, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { TopupContext } from '../main'
import useCreateOrder from '../../_hooks/useCreateOrder'

const Dialog = dynamic(() => import('@/components/common/dialog'))

function Main() {
  const { onScrollToView } = useContext(TopupContext)
  const { handleSubmit } = useFormContext()
  const { handleCreateOrder } = useCreateOrder()
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const [dialogValue, setDialogValue] = useState<{
    title: string
    description: string
    primaryCTAText: string
    onPrimaryCTAClick: () => void
  }>({
    title: '',
    description: '',
    primaryCTAText: '',
    onPrimaryCTAClick: () => {},
  })
  const dialogVisibleRef = useRef<boolean>(dialogVisible)

  useEffect(() => {
    dialogVisibleRef.current = dialogVisible
  }, [dialogVisible])

  const handleDialogClose = () => {
    setDialogVisible(!dialogVisibleRef.current)
    onScrollToView('packages')
  }

  const handlePayNowClick = (successCallback: () => void) => {
    handleSubmit(
      (data) => {
        successCallback()
      },
      (e) => {
        if (!e.phoneNumber?.message && !e.email?.message && e.package?.message) {
          setDialogVisible(true)
          setDialogValue({
            title: 'Bạn chưa chọn mệnh giá',
            description: e.package.message as string,
            primaryCTAText: 'Chọn mệnh giá',
            onPrimaryCTAClick: handleDialogClose,
          })
        }
      }
    )()
  }

  return (
    <>
      <PaymentButton
        appID={AppID.TOPUP}
        CTAText="Nạp ngay"
        onOrderConfirm={handleCreateOrder}
        onPayNowClick={handlePayNowClick}
      />

      {dialogVisible && (
        <Dialog visible={dialogVisible} onClose={() => setDialogVisible(false)} {...dialogValue} />
      )}
    </>
  )
}

export default function TopupNowButton() {
  return (
    <Suspense fallback={null}>
      <Main />
    </Suspense>
  )
}
