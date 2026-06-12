'use client'

import useIframe from '@/hooks/use-iframe'
import commonUtil from '@/utils/common'
import { Header as DGSHeader } from '@dgs/looknlearn'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactElement } from 'react'

interface HeaderProps {
  CustomHeader?: ReactElement
}

export default function Header({ CustomHeader }: HeaderProps) {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const isInIframe = useIframe()

  if (isInIframe) {
    return null
  }

  if (CustomHeader) {
    return CustomHeader
  }

  const handleNavigate = (path: string) => {
    const encrypt = searchParams?.get('encrypt') || ''
    const voucherToken = searchParams?.get('voucherToken') || ''
    const utmSource = searchParams?.get('utm_source') || ''

    path = commonUtil.buildPathWithSearchParams(path, {
      encrypt,
      voucherToken,
      utm_source: utmSource,
    })
    router.push(path)
  }

  return <DGSHeader currentPath={pathName || ''} onNavigate={handleNavigate} />
}
