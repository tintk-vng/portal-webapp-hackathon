import { ReactNode } from 'react'

interface BodyProps {
  children: ReactNode
}

export default function Body({ children }: BodyProps) {
  return <main className="m-auto pt-3 md:max-w-6xl md:px-6 md:pb-12 md:pt-6">{children}</main>
}
