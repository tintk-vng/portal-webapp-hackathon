'use client'

import commonAPI from '@/api-client/common'
import Badge, { BadgeType, BadgeVariant } from '@/components/common/badge'
import Skeleton from '@/components/common/skeleton'
import StaticImage from '@/components/common/static-image'
import { AppID, EVENT } from '@/constants/telco'
import commonModel from '@/models/common'
import { SOF } from '@/types/common'
import { DataPackage } from '@/types/telco'
import commonUtil from '@/utils/common'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { GameContext } from '../main'

export default function SourceOfFunds() {
  const { control, setValue } = useFormContext()
  const { onScrollToView } = useContext(GameContext)
  const [SOFs, setSOFs] = useState<SOF[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const selectedPackage = useWatch({
    control,
    name: 'package',
  }) as DataPackage
  const selectedSOF = useWatch({
    control,
    name: 'SOF',
  }) as SOF

  const handleSOFsFetch = useCallback(async () => {
    try {
      if (!selectedPackage.appID) {
        throw new Error('Failed to fetch SOFs: appID is missing')
      }
      const data = await commonAPI.getSOFs({ productLineID: selectedPackage.appID })
      const SOFs = commonModel.modelSOFs(data)
      setSOFs(SOFs)
    } catch (error) {
      console.log('Failed to fetch SOFs: ', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedPackage.appID])

  useEffect(() => {
    handleSOFsFetch()
  }, [handleSOFsFetch])

  useEffect(() => {
    if (!isLoading && !commonUtil.isEmpty(SOFs)) {
      setValue('SOF', SOFs[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SOFs])

  if (!isLoading && commonUtil.isEmpty(SOFs)) {
    return null
  }

  const handleSOFChange = (SOF: SOF) => {
    commonUtil.trackEvent({ ID: EVENT[AppID.GAME].SELECT_SOF })
    setValue('SOF', SOF)
    onScrollToView('order-details')
  }

  return (
    <div className="mb-4">
      <div className="mb-2 text-heading-md md:mb-3 md:text-heading-sm">Phương thức thanh toán</div>

      <div className="md:rounded-lg md:border md:border-dark-50 md:px-4 md:py-1">
        {SOFs.map((SOF) => (
          <div
            key={SOF.ID}
            className="flex h-11 cursor-pointer items-center gap-3 md:h-12"
            onClick={() => handleSOFChange(SOF)}
          >
            <label
              className="relative flex cursor-pointer items-center rounded-full"
              htmlFor={SOF.ID}
            >
              <input
                id={SOF.ID}
                className="before:content[''] peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-dark-200 transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-blue-800 before:opacity-0 before:transition-opacity checked:border-blue-800 hover:before:opacity-10"
                name={SOF.name}
                type="radio"
                checked={selectedSOF.ID === SOF.ID}
                onChange={() => handleSOFChange(SOF)}
              />

              <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-800 opacity-0 transition-opacity duration-200 peer-checked:opacity-100"></span>
            </label>

            <StaticImage src={SOF.logoURL} width={24} height={24} alt="sof-logo" />

            <label htmlFor={SOF.ID} className="flex items-center gap-1 text-label-lg">
              {SOF.name}

              {SOF.badgeText && (
                <Badge type={BadgeType.Ribbon1} variant={BadgeVariant.Positive} position="static">
                  {SOF.badgeText}
                </Badge>
              )}
            </label>
          </div>
        ))}

        {isLoading &&
          Array.apply(null, Array(4)).map((value, index) => (
            <div key={index} className="flex h-11 items-center gap-3 md:h-12">
              <Skeleton className="h-4 w-full rounded-lg" />
            </div>
          ))}
      </div>
    </div>
  )
}
