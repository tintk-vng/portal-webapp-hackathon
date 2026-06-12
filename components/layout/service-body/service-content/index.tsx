import { ReactNode } from 'react'

interface ServiceContentProps {
  children: ReactNode
}

export default function ServiceContent({ children }: ServiceContentProps) {
  return <div className="p-4 md:w-full md:p-0">{children}</div>
}
