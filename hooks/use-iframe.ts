import { supportIframe } from '@/utils/bill'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function useIframe(): boolean {
  const searchParams = useSearchParams()
  const [isInIframe, setIsInIframe] = useState<boolean>(searchParams?.get('iframe') === 'true')
  const isUTS = !!supportIframe(usePathname() || '') // For Bill only

  useEffect(() => {
    const handleIframeCheck = () => {
      try {
        setIsInIframe(
          ['true', '1'].includes(searchParams?.get('iframe') || 'false') ||
            window.self !== window.top ||
            isUTS
        )
      } catch (e) {
        // If an error occurs, assume we're in an iframe (cross-origin)
        setIsInIframe(true)
      }
    }

    handleIframeCheck()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isInIframe
}
