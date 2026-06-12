import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import StaticImage from '@/components/common/static-image'
import { Domain, MAPPED_PATH } from '@/constants/common'
import { Service } from '@/types/common'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface HorizontalTabsProps {
  services: Service[]
  onServiceSelect: (service: Service) => void
}

export default function HorizontalTabs({ services, onServiceSelect }: HorizontalTabsProps) {
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const horizontalTabsRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    // Auto scroll to active tab on initialization
    if (horizontalTabsRef.current) {
      try {
        const activeTabIndex = services.findIndex((service) => {
          const { appID, domain } = service
          const isPathMatched = commonUtil.isPathMatched(domain!, appID, pathName!)
          return isPathMatched
        })
        const el = horizontalTabsRef.current
        const elChildNodes = el.childNodes
        const activeElChildNode = elChildNodes[activeTabIndex] as HTMLLIElement
        el.scrollLeft = activeElChildNode.offsetLeft - 50

        // setTabPosition(activeTabIndex)
        // window.addEventListener('resize', () => setTabPosition(activeTabIndex))

        // return () => window.removeEventListener('resize', () => setTabPosition(activeTabIndex))
      } catch (error) {
        console.log('Failed to scroll to active tab: ', error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName])

  return (
    <ul
      ref={horizontalTabsRef}
      className="no-scrollbar relative flex flex-row flex-nowrap items-center space-x-2 overflow-x-scroll scroll-smooth p-4 pb-2 md:hidden"
    >
      {services.map((service) => {
        const { appID, name, logo, label, domain = Domain.TELCO, isExternal } = service
        const isPathMatched = commonUtil.isPathMatched(domain, appID, pathName!)
        let path = MAPPED_PATH[domain][appID]?.source || ''
        if (!isExternal) {
          const encrypt = searchParams?.get('encrypt') || ''
          const voucherToken = searchParams?.get('voucherToken') || ''
          const utmSource = searchParams?.get('utm_source') || ''

          path = commonUtil.buildPathWithSearchParams(path, {
            encrypt,
            voucherToken,
            utm_source: utmSource,
          })
        }

        return (
          <li
            key={appID}
            className={classNames({
              'relative flex h-10 shrink-0 items-center rounded-full border px-2 py-3 transition-colors duration-500':
                true,
              'border-blue-25 bg-blue-25': !isPathMatched,
              'border-blue-500 bg-white-500': isPathMatched,
            })}
          >
            <Link
              className="flex w-full items-center justify-center"
              href={path}
              passHref={isExternal}
              {...(isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
              onClick={() => onServiceSelect(service)}
            >
              <StaticImage src={logo} alt="service-logo" width={24} height={24} />

              <label className="ml-2 text-label-lg">{name}</label>
            </Link>

            {label && (
              <Badge type={BadgeType.Ribbon1} variant={BadgeVariant.Negative}>
                {label}
              </Badge>
            )}
          </li>
        )
      })}
    </ul>
  )
}
