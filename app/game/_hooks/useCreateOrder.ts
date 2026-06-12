import telcoAPI from '@/api-client/telco'
import useIframe from '@/hooks/use-iframe'
import { useSearchParams } from 'next/navigation'
import { useFormContext } from 'react-hook-form'

export default function useCreateOrder() {
  const { getValues } = useFormContext()
  const isInIframe = useIframe()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm_source') || ''

  const handleCreateOrder = async (failureCallback: () => void) => {
    try {
      const dataPackage = getValues('package')
      const response: any = await telcoAPI.createOrder({
        productID: dataPackage.appID,
        dataPackage,
        quantity: getValues('quantity'),
        email: getValues('email'),
        voucherCode: '',
        SOF: getValues('SOF'),
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
