'use client'

import Button, { ButtonType } from '@/components/common/button'
// import StateView from '@/components/common/state-view'
import { AppID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import { useRouter } from 'next/navigation'
import { ExtraInfo } from '.'
import Image from 'next/image'
import StaticImage from '@/components/common/static-image'
import { QRCodeCanvas } from 'qrcode.react'

export default function DownloadZPState({
  appID,
  title = 'Chưa thể kiểm tra hóa đơn',
  description = 'Hiện tại hệ thống không hỗ trợ tra cứu trên website, vui lòng tải ứng dụng Zalopay để thanh toán.',
  deeplink = '',
  onButtonClick,
}: ExtraInfo) {
  const router = useRouter()

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick()
    } else if (appID && appID in AppID) {
      router.push(MAPPED_PATH[Domain.BILL][appID]?.source || '')
    }
  }

  return (
    <div className="jutify-center flex flex-col items-center px-8 py-6">
      <div className="mt-6 text-center text-label-lg font-bold md:text-2xl">{title}</div>

      <div className="mt-2 text-center text-label-md text-dark-300 md:mt-4 md:text-base/[20px]">
        {description}
      </div>
      {deeplink ? (
        <div className="mt-2">
          <QRCodeCanvas value={deeplink} size={180} />
        </div>
      ) : (
        <StaticImage
          className="mt-2"
          src="https://scdn.zalopay.com.vn/zst/zpi/images/bill/qr_code_download_zp.png"
          width={180}
          height={180}
          priority
          loader={({ src }) => src}
          alt="state-view-artwork"
        />
      )}
      <div className="text-center text-label-md text-dark-500 md:text-base/[20px]">
        Dùng điện thoại quét QR Code để tải app
      </div>
      <div className="flex flex-row items-center justify-center py-4">
        <div className="borer-dark-100 w-[72px]	border" />
        <div className="px-3 text-label-md text-dark-300 md:text-base/[20px]">hoặc</div>
        <div className="borer-dark-100 w-[72px]	border" />
      </div>
      <div className="flex flex-row items-center justify-center gap-3">
        <button
          onClick={() => {
            window.open('https://apps.apple.com/app/apple-store/id1112407590', '_blank')
          }}
        >
          <Image
            src="https://scdn.zalopay.com.vn/zst/zpi/images/bill/download_app_store.svg"
            width={171}
            height={48}
            priority
            alt="download-app-store"
          />
        </button>
        <button
          onClick={() => {
            window.open(
              'https://play.google.com/store/apps/details?id=vn.com.vng.zalopay',
              '_blank'
            )
          }}
        >
          <StaticImage
            src="https://scdn.zalopay.com.vn/zst/zpi/images/bill/download_google_play.svg"
            width={171}
            height={48}
            priority
            alt="download-app-store"
          />
        </button>
      </div>
    </div>
  )
}
