import phoneCardAPI from '@/api-client/telco/phone-card'
import useIframe from '@/hooks/use-iframe'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { PhoneCardContext } from '../_components/main'

export default function useCreateOrder() {
  const { selectedSupplier } = useContext(PhoneCardContext)
  const { getValues } = useFormContext()
  const isInIframe = useIframe()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm_source') || ''

  const handleCreateOrder = async (failureCallback: () => void) => {
    try {
      const phoneCardPackage = getValues('package')
      const response: any = await phoneCardAPI.createOrder({
        email: getValues('email'),
        voucherCode: getValues('voucherCode'),
        amount: phoneCardPackage.amount,
        telcoCode: selectedSupplier.telcoCode,
        quantity: getValues('quantity'),
        packageID: phoneCardPackage.ID,
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
      failureCallback()
    }
  }

  return { handleCreateOrder }
}
