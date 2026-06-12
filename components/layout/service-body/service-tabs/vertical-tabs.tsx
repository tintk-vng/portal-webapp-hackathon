import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import StaticImage from '@/components/common/static-image'
import { Domain, MAPPED_PATH } from '@/constants/common'
import { Service } from '@/types/common'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './styles.module.scss'

interface VerticalTabsProps {
  services: Service[]
  onServiceSelect: (service: Service) => void
}

export default function VerticalTabs({ services, onServiceSelect }: VerticalTabsProps) {
  const pathName = usePathname()
  const searchParams = useSearchParams()

  return (
    <aside className="sticky left-0 right-0 top-[72px] hidden pr-6 md:block">
      <div className="mb-4 text-heading-lg">Dịch vụ cung cấp</div>

      <ul className="relative space-y-3">
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
                'relative flex h-[68px] items-center rounded-lg border transition duration-300 hover:border-blue-500 hover:bg-white-500':
                  true,
                'border-other-background bg-other-background md:hover:scale-105': !isPathMatched,
                'border-blue-500 bg-white-500': isPathMatched,
              })}
            >
              <Link
                className="flex w-full items-center justify-between p-4"
                href={path}
                passHref={isExternal}
                {...(isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                onClick={() => onServiceSelect(service)}
              >
                <div className="flex items-center overflow-hidden">
                  <StaticImage src={logo} alt="service-logo" width={36} height={36} />

                  <label className="ml-3 cursor-pointer truncate text-label-lg">{name}</label>
                </div>

                {isExternal && <span className={styles.nextIcon} />}
              </Link>

              {label && (
                <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Negative}>
                  {label}
                </Badge>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
