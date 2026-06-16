'use client'

import ErrorBoundary from '@/components/layout/error-boundary'
// import HighlightBanner from '@/components/layout/highlight-banner'
import { AppID, DataPackageType, PackageStatus, SupplierStatus, TelcoCode } from '@/constants/telco'
import { useLoadPageEventTracking } from '@/hooks/use-load-page-event-tracking'
import { SOF } from '@/types/common'
import { DataPackage, DataSupplier } from '@/types/telco'
import dynamic from 'next/dynamic'
import { createContext, useCallback, useRef, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { getPopularSearchItems, topupItems, resolveGameToPublisher } from '@/src/data/catalog'
import { getActiveCampaign } from '@/src/data/campaigns'
import { getEnabledArticles } from '@/src/data/newsArticles'
import SearchBar from '../search/SearchBar'
import PopularSearchChips from '../search/PopularSearchChips'
import BannerSlot from '../banner-slot/BannerSlot'
import NewsCards from '../news-cards/NewsCards'
import EmailInput from '../email-input'
import HighlightBlogs from '../highlight-blogs'
import OrderDetails from '../order-details'
import Packages from '../packages'
import Promotion from '../promotion'
import SourceOfFunds from '../source-of-funds'
import { StateType } from '../state'
import SkeletonState from '../state/skeleton-state'
import Suppliers from '../suppliers'

const State = dynamic(() => import('../state'), {
  loading: () => <SkeletonState />,
})

interface GameContextType {
  onScrollToView: (view: string) => void
  suppliers: DataSupplier[]
  setSuppliers: (suppliers: DataSupplier[]) => void
  onSelectSupplier: (cb: (supplier: DataSupplier) => void) => void
}

export const GameContext = createContext({} as GameContextType)

const defaultSupplier: DataSupplier = {
  telcoCode: TelcoCode.INVALID,
  status: SupplierStatus.ACTIVE,
  packageGroups: [
    {
      ID: '',
      name: '',
      packages: [
        {
          ID: '1',
          appID: AppID.GAME,
          telcoCode: TelcoCode.INVALID,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          originalAmount: 10000,
          amount: 9700,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '2',
          appID: AppID.GAME,
          telcoCode: TelcoCode.INVALID,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          originalAmount: 20000,
          amount: 19400,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '3',
          appID: AppID.GAME,
          telcoCode: TelcoCode.INVALID,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          originalAmount: 50000,
          amount: 48500,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '4',
          appID: AppID.GAME,
          telcoCode: TelcoCode.INVALID,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          originalAmount: 100000,
          amount: 97000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '5',
          appID: AppID.GAME,
          telcoCode: TelcoCode.INVALID,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          originalAmount: 200000,
          amount: 194000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '6',
          appID: AppID.GAME,
          telcoCode: TelcoCode.INVALID,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          originalAmount: 500000,
          amount: 485000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
        {
          ID: '7',
          appID: AppID.GAME,
          telcoCode: TelcoCode.INVALID,
          type: DataPackageType.FIXED,
          code: '',
          name: '',
          originalAmount: 1000000,
          amount: 970000,
          capacity: {
            value: 0,
            unit: 'MB',
            display: '',
          },
          duration: {
            value: 0,
            unit: 'HOUR',
            display: '',
          },
          status: PackageStatus.ACTIVE,
          badgeText: '',
          features: [],
        },
      ],
    },
  ],
}

type FormValues = {
  supplier: DataSupplier
  package: DataPackage
  quantity: number
  amount: number
  email: string
  SOF: SOF
  stateType: StateType | undefined
}

interface MainProps {
  subCategoryID: number | undefined
}

export default function Main({ subCategoryID }: MainProps) {
  useLoadPageEventTracking({ appID: AppID.GAME })
  const methods = useForm<FormValues>({
    defaultValues: {
      supplier: defaultSupplier,
      package: {},
      quantity: 1,
      amount: 0,
      email: '',
      SOF: {},
      stateType: undefined,
    } as FormValues,
  })
  const stateType = useWatch({
    control: methods.control,
    name: 'stateType',
  }) as StateType
  const suppliersRef = useRef<HTMLDivElement | null>(null)
  const packagesRef = useRef<HTMLDivElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const orderDetailsRef = useRef<HTMLDivElement | null>(null)

  const [suppliersList, setSuppliersList] = useState<DataSupplier[]>([])
  const [supplierSelectCallback, setSupplierSelectCallback] = useState<((supplier: DataSupplier) => void) | null>(null)

  const handleScrollToView = (view: string) => {
    switch (view) {
      case 'suppliers':
        packagesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        break
      case 'packages':
        packagesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        break
      case 'email-input':
        emailInputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        break
      case 'order-details':
        orderDetailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        break
      default:
        break
    }
  }

  const handleResolveTopupItem = (item: any) => {
    const publisher = resolveGameToPublisher(item.id)
    if (!publisher) return

    const matchedSupplier = suppliersList.find(
      (s) => s.telcoCode.toUpperCase() === publisher.id.toUpperCase()
    )
    if (matchedSupplier && supplierSelectCallback) {
      supplierSelectCallback(matchedSupplier)
    }
  }

  const popularSearchItems = getPopularSearchItems()
  const activeCampaign = getActiveCampaign()
  const activeArticles = getEnabledArticles()

  const handleSelectSupplier = useCallback(
    (cb: (supplier: DataSupplier) => void) => setSupplierSelectCallback(() => cb),
    []
  )

  return (
    <ErrorBoundary appID={AppID.GAME}>
      <GameContext.Provider
        value={{
          onScrollToView: handleScrollToView,
          suppliers: suppliersList,
          setSuppliers: setSuppliersList,
          onSelectSupplier: handleSelectSupplier,
        }}
      >
        <FormProvider {...methods}>
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-6">
            <div className="col-span-2">
              <div className="block md:hidden">
                <Promotion />
              </div>

              <BannerSlot campaign={activeCampaign} />

              <SearchBar items={topupItems} onSelect={handleResolveTopupItem} />
              <PopularSearchChips items={popularSearchItems} onSelect={handleResolveTopupItem} />

              <Suppliers innerRef={suppliersRef} />

              {(() => {
                if (stateType) {
                  return <State />
                }

                return (
                  <>
                    <Packages innerRef={packagesRef} />

                    <EmailInput innerRef={emailInputRef} />
                  </>
                )
              })()}

              <div className="hidden md:block mt-8">
                {activeArticles.length > 0 ? (
                  <NewsCards articles={activeArticles} />
                ) : (
                  <HighlightBlogs subCategoryID={subCategoryID} />
                )}
              </div>
            </div>

            <div>
              <div className="mb-4 hidden text-heading-lg md:block">Thanh toán</div>

              <div className="hidden md:block">
                <Promotion />
              </div>

              <SourceOfFunds />

              <OrderDetails innerRef={orderDetailsRef} />

              <div className="md:hidden mt-6">
                {activeArticles.length > 0 ? (
                  <NewsCards articles={activeArticles} />
                ) : (
                  <HighlightBlogs subCategoryID={subCategoryID} />
                )}
              </div>
            </div>
          </div>
        </FormProvider>
      </GameContext.Provider>
    </ErrorBoundary>
  )
}
