'use client'

import { EVENT } from '@/constants/common'
import { TrackingEvent, Transaction } from '@/types/common'
import commonUtil from '@/utils/common'
import { useRouter } from 'next/navigation'

function generateSupportURL(transaction: Transaction) {
  let url = process.env.NEXT_PUBLIC_ZLP_SUPPORT_URL + '/customer/gateway?source=payment-gateway'
  let moreInfoParam: Record<string, unknown> = {
    platform: 'DGS website',
  }
  if (!commonUtil.isEmpty(transaction)) {
    moreInfoParam = {
      ...moreInfoParam,
      app: transaction.appID,
      appTransID: transaction.appTransID,
      transactionEmail: transaction.email,
      note: '',
      amount: transaction.amount,
    }
    const customData = transaction.customData
    moreInfoParam.merchantStatus = customData.status
    moreInfoParam.paymentChannel = customData.payment_channel
    moreInfoParam = Object.fromEntries(
      Object.entries(moreInfoParam).filter(([_, value]) => value != null)
    )
  }
  const moreInfoParamStr = JSON.stringify(moreInfoParam)
  const encodedParam = btoa(unescape(encodeURIComponent(moreInfoParamStr)))
  url += `&more-info=${encodedParam}`
  return url
}

function CTA({
  title,
  onClick,
  preIconLink,
  postIconLink,
  event,
}: {
  title: string
  onClick: () => void
  preIconLink?: string
  postIconLink?: string
  event?: TrackingEvent
}) {
  function handleClick() {
    if (event) {
      commonUtil.trackEvent(event)
    }
    onClick?.()
  }

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center rounded-lg bg-other-background p-4 transition active:bg-white-500 active:ring-1 active:ring-blue-500"
      onClick={handleClick}
    >
      {/* {preIconLink && (
        <span
          className={classNames(
            'mr-3 h-[24px] w-[24px] rounded bg-cover bg-center bg-no-repeat',
            iconStyles[preIconLink]
          )}
        />
      )} */}

      <p className="flex-1 text-left text-label-lg">{title}</p>

      {/* {postIconLink && (
        <span
          className={classNames(
            'ml-3 h-[24px] w-[24px] rounded bg-cover bg-center bg-no-repeat',
            iconStyles[postIconLink]
          )}
        />
      )} */}
    </button>
  )
}

interface CTAsProps {
  transaction: Transaction
}

export default function CTAs({ transaction }: CTAsProps) {
  const router = useRouter()
  const supportURL = generateSupportURL(transaction)

  const handleSupportClick = () => {
    window.open(supportURL, '_blank')
  }

  const handleBuyMoreClick = () => {
    router.push('/')
  }

  return (
    <div className="mt-4 flex flex-col gap-2 md:mt-10 md:flex-row md:gap-6">
      {supportURL && (
        <CTA
          title="Yêu cầu hỗ trợ"
          onClick={handleSupportClick}
          event={{ ID: EVENT.RESULT_PAGE.CLICK_SUPPORT }}
        />
      )}

      <CTA
        title="Mua tiếp"
        onClick={handleBuyMoreClick}
        event={{
          ID: EVENT.RESULT_PAGE.CLICK_CUSTOM_BUTTON,
          metaData: { cta_name: 'Mua tiếp' },
        }}
      />
    </div>
  )
}
