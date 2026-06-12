'use client'

import useIframe from '@/hooks/use-iframe'
import { Footer as DGSFooter } from '@dgs/looknlearn'

export default function Footer() {
  const isInIframe = useIframe()

  if (isInIframe) {
    return null
  }

  return <DGSFooter />
}
