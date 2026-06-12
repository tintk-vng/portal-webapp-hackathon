'use client'

import useIframe from '@/hooks/use-iframe'
import { Service } from '@/types/common'
import commonUtil from '@/utils/common'
import HorizontalTabs from './horizontal-tabs'
import VerticalTabs from './vertical-tabs'

interface ServiceTabsProps {
  services: Service[]
}

export default function ServiceTabs({ services }: ServiceTabsProps) {
  const isInIframe = useIframe()

  if (isInIframe) {
    return null
  }

  const handleServiceSelect = (service: Service) => {
    service.event &&
      commonUtil.trackEvent({ ID: service.event.ID, metaData: { service_name: service.name } })
  }

  return (
    <div className="md:width-full md:min-w-[256px] md:space-x-4 md:border-r md:border-dark-50 lg:min-w-[276px]">
      <VerticalTabs services={services} onServiceSelect={handleServiceSelect} />

      <HorizontalTabs services={services} onServiceSelect={handleServiceSelect} />
    </div>
  )
}
