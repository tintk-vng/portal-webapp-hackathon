import topupAPI from '@/api-client/telco/topup'
import useIframe from '@/hooks/use-iframe'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { TopupContext } from '../_components/main'

export default function useCreateOrder() {
  const { selectedSupplier } = useContext(TopupContext)
  const { getValues } = useFormContext()
  const isInIframe = useIframe()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm_source') || ''

  const handleCreateOrder = async (failureCallback?: () => void) => {
    try {
      const topupPackage = getValues('package')
      const response: any = await topupAPI.createOrder({
        email: getValues('email'),
        voucherCode: getValues('voucherCode'),
        amount: getValues('package').amount,
        phoneNumber: getValues('phoneNumber'),
        telcoCode: selectedSupplier.telcoCode,
        quantity: 1,
        packageID: topupPackage.ID,
        utmSource,
      })
      if (isInIframe) {
        setTimeout(() => {
          window.open(response.order_url, '_blank')
        })
      } else {
        window.location.href = response.order_url
      }
    } catch (error) {
      console.log('Failed to create order: ', error)
      failureCallback?.()
    }
  }

  return { handleCreateOrder }
}
