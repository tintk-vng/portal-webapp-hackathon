'use client'

import Button, { ButtonSize, ButtonType } from '@/components/common/button'
import Toast from '@/components/common/toast'
import highlightBannerStyles from '@/components/layout/highlight-banner/styles.module.scss'
import { Card } from '@/types/common'
import commonUtil from '@/utils/common'
import { useState } from 'react'
import 'swiper/css'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface VirtualCardProps {
  card: Card
  cardName: string
  index: number
  onCopyToClipboard: (content: string) => void
}

function VirtualCard({ card, cardName, index, onCopyToClipboard }: VirtualCardProps) {
  return (
    <div>
      <div className="mb-3 text-heading-sm font-normal">Mã thẻ {index + 1}</div>

      <div className="overflow-hidden rounded-lg border border-blue-100 bg-white-500">
        <div className="flex items-center justify-between bg-other-background px-4 py-2">
          <div className="text-label-lg font-bold">{cardName}</div>

          {card.expireTime && (
            <div className="text-label-md text-dark-300">HSD: {card.expireTime}</div>
          )}
        </div>

        <div className="flex flex-col items-center px-8 py-2">
          <div className='h-full w-full bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/patterns/silver_foil_2.svg")] bg-contain bg-no-repeat p-1'>
            <div className="flex items-center justify-center bg-blue-25 px-3 py-1 text-label-lg font-bold">
              {card.code}
            </div>
          </div>

          <div className="mt-2 text-center text-label-sm text-dark-300">
            Số seri: {card.serialNo}
          </div>
        </div>

        <div className="flex gap-3 px-8 pb-3">
          <Button
            width="w-full flex-1"
            type={ButtonType.SECONDARY}
            size={ButtonSize.SMALL}
            bold={false}
            onClick={() => onCopyToClipboard(card.serialNo)}
          >
            Sao chép Số seri
          </Button>

          <Button
            width="w-full flex-1"
            type={ButtonType.SECONDARY}
            size={ButtonSize.SMALL}
            bold={false}
            onClick={() => onCopyToClipboard(card.code)}
          >
            Sao chép mã thẻ
          </Button>
        </div>
      </div>
    </div>
  )
}

const cardSwiperPagination = {
  enabled: true,
  clickableClass: highlightBannerStyles.paginationBullets,
  bulletClass: highlightBannerStyles.paginationBullet,
  bulletActiveClass: highlightBannerStyles.paginationBulletActive,
  clickable: true,
  renderBullet: (index: number, className: string) => {
    return '<span class="' + className + '"></span>'
  },
}

interface HorizontalVirtualCardsProps {
  cards: Card[]
  cardName: string
}

export default function HorizontalVirtualCards({ cards, cardName }: HorizontalVirtualCardsProps) {
  const [toastVisible, setToastVisible] = useState(false)
  const hasMoreCards = cards.length > 1

  const handleCopyToClipboard = async (content: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(content)
        setToastVisible(true)
      }
    } catch (error) {
      console.log('Failed to copy to clipboard: ', error)
    }
  }

  if (commonUtil.isEmpty(cards)) {
    return null
  }

  return (
    <div>
      <div className="mb-3 text-heading-sm md:mb-4">Thông tin mã thẻ</div>

      <div className="relative mb-6 md:mb-10">
        <Swiper
          slidesPerView={1}
          spaceBetween={12}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
          }}
          pagination={hasMoreCards ? cardSwiperPagination : false}
          modules={[Pagination]}
          className="!static w-full"
        >
          {cards.map((card, index) => (
            <SwiperSlide key={card.code} className="!h-auto">
              <VirtualCard
                card={card}
                cardName={cardName}
                index={index}
                onCopyToClipboard={handleCopyToClipboard}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Toast
        iconURL=""
        visible={toastVisible}
        message="Đã sao chép"
        onClose={() => setToastVisible(false)}
      />
    </div>
  )
}
