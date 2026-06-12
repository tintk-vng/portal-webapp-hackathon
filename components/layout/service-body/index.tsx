import { Service } from '@/types/common'
import { ReactNode } from 'react'
import ServiceContent from './service-content'
import ServiceTabs from './service-tabs'

interface ServiceBodyProps {
  children: ReactNode
  services: Service[]
}

export default function ServiceBody({ children, services }: ServiceBodyProps) {
  return (
    <div className="flex flex-col md:flex-row md:space-x-10">
      <ServiceTabs services={services} />

      <ServiceContent>{children}</ServiceContent>
    </div>
  )
}
