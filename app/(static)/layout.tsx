import Body from '@/components/layout/body'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { ReactNode } from 'react'

export default function StaticLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />

      <Body>{children}</Body>

      <Footer />
    </>
  )
}
