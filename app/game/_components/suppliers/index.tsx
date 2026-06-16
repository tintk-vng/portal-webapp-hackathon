'use client'

import gameAPI from '@/api-client/telco/game'
import googlePlayAPI from '@/api-client/telco/google-play'
import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import StaticImage from '@/components/common/static-image'
import { API_PATH, AppID, EVENT, PackageStatus, SupplierStatus, TelcoCode } from '@/constants/telco'
import useCustomSWR from '@/hooks/use-custom-swr'
import telcoModel from '@/models/telco'
import { DataSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import { MutableRefObject, useContext, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { GameContext } from '../main'
import { StateType } from '../state'
import { getActiveCampaign } from '@/src/data/campaigns'
import { getDiscountForPublisher } from '@/src/data/discounts'

const getSupplierLogoByTelcoCode = (telcoCode: TelcoCode) => {
  if (telcoCode in TelcoCode && telcoCode !== TelcoCode.INVALID) {
    return `https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/${telcoCode.toLowerCase()}.png`
  }
  return 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/supplier_placeholder.svg'
}

const defaultSuppliers: DataSupplier[] = [
  {
    telcoCode: TelcoCode.GARENA,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.VTC,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.ZING,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.KUL,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.SCOIN,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.SOHACOIN,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.FUNCARD,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.GOSU,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.APPOTA,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
  {
    telcoCode: TelcoCode.GOOGLEPLAY,
    status: SupplierStatus.ACTIVE,
    packageGroups: [],
  },
]

interface SuppliersProps {
  innerRef: MutableRefObject<HTMLDivElement | null>
}

export default function Suppliers({ innerRef }: SuppliersProps) {
  const searchParams = useSearchParams()
  const { control, setValue, setFocus } = useFormContext()
  const { onScrollToView, setSuppliers, onSelectSupplier } = useContext(GameContext)
  const { data, error, isLoading } = useCustomSWR(
    API_PATH[AppID.GAME].GET_SUPPLIERS,
    gameAPI.getSuppliers
  )
  const { data: googlePlaySuppliersData } = useCustomSWR(
    API_PATH[AppID.GOOGLEPLAY].GET_SUPPLIERS,
    googlePlayAPI.getSuppliers
  )
  const gameSuppliers = telcoModel.modelSuppliers(data)
  const [googlePlaySupplier] = telcoModel.modelSuppliers(googlePlaySuppliersData)
  const suppliers = googlePlaySupplier ? [...gameSuppliers, googlePlaySupplier] : gameSuppliers
  const selectedSupplier = useWatch({
    control,
    name: 'supplier',
  }) as DataSupplier

  const displaySuppliers = commonUtil.isEmpty(suppliers) ? defaultSuppliers : suppliers

  const handleSupplierChange = (supplier: DataSupplier) => {
    if (isLoading) {
      return
    }
    commonUtil.trackEvent({
      ID: EVENT[AppID.GAME].SELECT_SUPPLIER,
      metaData: {
        supplier: {
          telco_code: supplier.telcoCode,
          status: supplier.status,
        },
      },
    })
    setValue('supplier', supplier)
    // setValue('quantity', 1)
    if (supplier.status !== SupplierStatus.ACTIVE || commonUtil.isEmpty(supplier.packageGroups)) {
      setValue('stateType', StateType.MAINTENANCE)
    } else {
      setValue('stateType', undefined)
    }
  }

  useEffect(() => {
    if (displaySuppliers && displaySuppliers.length > 0) {
      setSuppliers(displaySuppliers)
    }
  }, [displaySuppliers, setSuppliers])

  useEffect(() => {
    onSelectSupplier(handleSupplierChange)
  }, [onSelectSupplier, handleSupplierChange])

  const setDefaultParams = () => {
    try {
      const defaultTelcoCode = searchParams?.get('telco_code') || ''
      const defaultAmount = Number(searchParams?.get('amount') || '0')
      const defaultEmail = commonUtil.b64DecodeUnicode(searchParams?.get('email') || '')
      const telcoCode =
        defaultTelcoCode in TelcoCode ? (defaultTelcoCode as TelcoCode) : TelcoCode.INVALID
      const matchedSupplier = suppliers.find((supplier) => supplier.telcoCode === telcoCode)
      if (matchedSupplier) {
        setValue('supplier', matchedSupplier)
        matchedSupplier.packageGroups.forEach((packageGroup) => {
          const matchedPackage = packageGroup.packages.find(
            (gamePackage) =>
              gamePackage.amount === defaultAmount && gamePackage.status === PackageStatus.ACTIVE
          )
          if (matchedPackage) {
            setValue('package', matchedPackage)
            setValue('quantity', 1)
            onScrollToView('invoice-input')
            setTimeout(() => {
              setFocus('email')
            }, 500)
            return
          }
        })
      }
      setValue('email', defaultEmail)
      if (defaultTelcoCode && defaultAmount && defaultEmail) {
        setTimeout(() => {
          const paymentButton = document.getElementById('telco-one-click-payment-button')
          paymentButton?.click()
        }, 500)
      }
    } catch (error) {
      console.log('Failed to set default params: ', error)
    }
  }

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (error) {
      setValue('stateType', StateType.MAINTENANCE)
      return
    }
    setDefaultParams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])



  return (
    <div ref={innerRef} className="mb-6">
      <div className="mb-3 text-heading-md md:mb-4 md:text-heading-lg">Chọn loại thẻ</div>

      <ul className="grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-6">
        {displaySuppliers.map((supplier) => {
          const isSelected = supplier.telcoCode === selectedSupplier.telcoCode
          // const isActive = supplier.status === SupplierStatus.ACTIVE
          const isMaintained =
            supplier.status === SupplierStatus.MAINTENANCE ||
            (!isLoading && commonUtil.isEmpty(suppliers))

          return (
            <li
              key={supplier.telcoCode}
              className={classNames({
                'relative h-[60px] cursor-pointer rounded-lg border px-2 py-1 transition md:hover:border-blue-500':
                  true,
                'variant-dark-50 md:hover:scale-105': !isSelected,
                'border-blue-500': isSelected,
                // 'bg-dark-25': isMaintained,
              })}
              onClick={() => handleSupplierChange(supplier)}
            >
              <div className="relative flex h-full w-full items-center justify-center">
                <StaticImage
                  className={classNames({ grayscale: isMaintained, '!inset-auto !w-auto': true })}
                  src={getSupplierLogoByTelcoCode(supplier.telcoCode)}
                  fill
                  alt="supplier-logo"
                  loader={({ src }) => src}
                />
              </div>

              {isMaintained && (
                <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Neutral}>
                  Bảo trì
                </Badge>
              )}

              {/* {isActive && supplier.badgeText && (
                <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Negative}>
                  {supplier.badgeText}
                </Badge>
              )} */}

              {(() => {
                if (isMaintained) return null;
                const activeCampaign = getActiveCampaign()
                if (!activeCampaign) return null
                const badgeInfo = getDiscountForPublisher(activeCampaign, supplier.telcoCode.toLowerCase())
                if (!badgeInfo) return null
                return (
                  <Badge type={BadgeType.Ribbon2} variant={BadgeVariant.Negative}>
                    {badgeInfo.label}
                  </Badge>
                )
              })()}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
