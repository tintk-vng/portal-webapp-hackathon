'use client'

import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import StaticImage from '@/components/common/static-image'
import { AppID, EVENT, SupplierStatus } from '@/constants/telco'
import { DataSupplier, TopupSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'
import classNames from 'classnames'
import { MutableRefObject } from 'react'

interface SupplierCardsProps {
  innerRef: MutableRefObject<HTMLDivElement | null>
  appID: AppID
  defaultSuppliers: Array<TopupSupplier | DataSupplier>
  suppliers: Array<TopupSupplier | DataSupplier>
  isLoading: boolean
  selectedSupplier: TopupSupplier | DataSupplier
  onSupplierChange: Function
}

export default function SupplierCards({
  innerRef,
  appID,
  defaultSuppliers,
  suppliers,
  isLoading,
  selectedSupplier,
  onSupplierChange,
}: SupplierCardsProps) {
  const displaySuppliers = commonUtil.isEmpty(suppliers) ? defaultSuppliers : suppliers

  const handleSupplierChange = (supplier: TopupSupplier | DataSupplier) => {
    commonUtil.trackEvent({
      ID: EVENT[appID].SELECT_SUPPLIER,
      metaData: {
        supplier: {
          telco_code: supplier.telcoCode,
          status: supplier.status,
        },
      },
    })
    onSupplierChange(supplier)
  }

  return (
    <div ref={innerRef} className="mb-6">
      <div className="mb-3 text-heading-sm md:mb-4">Chọn nhà cung cấp</div>

      <ul className="grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-6">
        {displaySuppliers.map((supplier) => {
          const isSelectedSupplier = supplier.telcoCode === selectedSupplier.telcoCode
          const isMaintained =
            supplier.status === SupplierStatus.MAINTENANCE ||
            (!isLoading && commonUtil.isEmpty(suppliers))

          return (
            <li
              key={supplier.telcoCode}
              className={classNames({
                'relative h-16 cursor-pointer rounded-lg border transition md:h-[72px] md:hover:border-blue-500 md:hover:bg-other-background':
                  true,
                'variant-dark-50 md:hover:scale-105': !isSelectedSupplier,
                'border-blue-500 bg-other-background': isSelectedSupplier,
                'bg-dark-25': isMaintained,
              })}
              onClick={() => handleSupplierChange(supplier)}
            >
              <StaticImage
                className={classNames({
                  grayscale: isMaintained,
                })}
                src={telcoUtil.getSupplierLogoByTelcoCode(supplier.telcoCode)}
                fill
                alt="supplier-logo"
              />

              {isMaintained && (
                <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Neutral}>
                  Bảo trì
                </Badge>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
