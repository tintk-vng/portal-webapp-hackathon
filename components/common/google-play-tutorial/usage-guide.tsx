'use client'

import BottomSheet from '@/components/common/bottom-sheet'
import Image from '@/components/common/image'
import Inform, { InformType } from '@/components/common/inform'
import { AppID, EVENT } from '@/constants/telco'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { ReactElement, useEffect, useState } from 'react'
import 'swiper/css'
import styles from './styles.module.scss'

enum Tab {
  WEBSITE = 'WEBSITE',
  APP = 'APP',
}

const tutorialImages = {
  [Tab.WEBSITE]: [
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/desktop_google_play_tutorial_step_1.png',
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/desktop_google_play_tutorial_step_2.png',
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/desktop_google_play_tutorial_step_3.png',
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/desktop_google_play_tutorial_step_4.png',
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/desktop_google_play_tutorial_step_5.png',
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/desktop_google_play_tutorial_step_6.png',
  ],
  [Tab.APP]: [
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/google_play_tutorial_step_1.png',
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/google_play_tutorial_step_2.png',
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/google_play_tutorial_step_3.png',
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/google_play_tutorial_step_4.png',
    'https://scdn.zalopay.com.vn/zst/zpi/images/telco/others/google_play_tutorial_step_5.png',
  ],
}

export function UsageGuide() {
  const { size } = useScreen()
  const isMobile = size === ScreenSize.SMALL
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.APP)
  const [visible, setVisible] = useState<boolean>(false)
  const [activeSheet, setActiveSheet] = useState<number>(1)

  useEffect(() => {
    setSelectedTab(isMobile ? Tab.APP : Tab.WEBSITE)
  }, [isMobile])

  const handlePolicyView = () => {
    commonUtil.trackEvent({ ID: EVENT[AppID.GOOGLEPLAY].VIEW_POLICY })
    setActiveSheet(2)
  }

  const handleBottomSheetOpen = () => {
    commonUtil.trackEvent({ ID: EVENT[AppID.GOOGLEPLAY].CLICK_TUTORIAL })
    setVisible(true)
  }

  const handleBottomSheetClose = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    commonUtil.trackEvent({ ID: EVENT[AppID.GOOGLEPLAY].CLICK_UNDERSTOOD_BUTTON })
    setVisible(false)
    setActiveSheet(1)
  }

  const sheets: {
    [key: number]: {
      title: string
      content: ReactElement
      primaryCTAText?: string
      onPrimaryCTAClick?: () => void
    }
  } = {
    1: {
      title: 'Hướng dẫn sử dụng',
      content: (
        <>
          <div className="sticky top-[-16px] grid grid-cols-2 gap-3 bg-white-500 pb-4">
            <div
              className={classNames({
                'flex h-8 cursor-pointer items-center justify-center rounded-full border border-blue-25 bg-blue-25 px-3 py-2 text-label-md transition-colors duration-500':
                  true,
                'border-blue-500 bg-white-500 text-blue-500': selectedTab === Tab.WEBSITE,
              })}
              onClick={() => setSelectedTab(Tab.WEBSITE)}
            >
              Website
            </div>

            <div
              className={classNames({
                'flex h-8 cursor-pointer items-center justify-center rounded-full border border-blue-25 bg-blue-25 px-3 py-2 text-label-md transition-colors duration-500':
                  true,
                'border-blue-500 bg-white-500 text-blue-500': selectedTab === Tab.APP,
              })}
              onClick={() => setSelectedTab(Tab.APP)}
            >
              Ứng dụng
            </div>
          </div>

          <Inform type={InformType.WARNING}>
            <div className="flex items-start justify-center space-x-2">
              <span className={styles.warningIcon} />

              <label className="text-label-sm">
                {`Khách hàng sẽ không được hoàn tiền nếu đã mua/nhận thẻ thành công trên Zalopay.
                Trong trường hợp thẻ bị lỗi, Nhà cung cấp sẽ trực tiếp chuyển đổi mã thẻ mới cho
                khách hàng. Mọi vấn đề liên quan đến hoàn trả sẽ phụ thuộc vào quyết định của Nhà
                cung cấp. Cụ thể, khách hàng có thể xem "Điều khoản sử dụng" tại mục "Hướng dẫn sử
                dụng".`}
              </label>
            </div>
          </Inform>

          {tutorialImages[selectedTab].map((image, index) => (
            <Image
              key={index}
              className="mt-4 h-auto w-full"
              src={image}
              width={1}
              height={1}
              alt="popular-services"
              loader={({ src }) => src}
            />
          ))}

          <div className="mb-3 mt-4 rounded-lg border border-other-stroke px-4 py-2">
            <label className="mb-2 text-label-md font-bold">Lưu ý:</label>

            <ul className="list-inside list-disc">
              <li>
                <label className="text-label-sm">
                  Để sử dụng, hãy nhập mã vào ứng dụng Cửa hàng Play hoặc{' '}
                  <a
                    className="text-blue-500"
                    href="https://play.google.com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    play.google.com
                  </a>
                </label>
              </li>

              <li className="mb-2">
                <label className="text-label-sm">
                  Chỉ sử dụng mã thẻ quà tặng này trên Cửa hàng Play. Nếu bạn nhận được yêu cầu nhập
                  mã này ở bất cứ đâu ngoài Cửa hàng Play thì đó đều có thể là hành vi lừa đảo. Để
                  biết thêm thông tin, hãy truy cập{' '}
                  <a
                    className="text-blue-500"
                    href="https://play.google.com/giftcardscam"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    play.google.com/giftcardscam
                  </a>
                </label>
              </li>
            </ul>
          </div>

          <div
            className="flex cursor-pointer items-center justify-between rounded-lg bg-other-background px-4 py-3"
            onClick={handlePolicyView}
          >
            Điều khoản sử dụng
            <span className={styles.arrowNextIcon} />
          </div>
        </>
      ),
      primaryCTAText: 'Đã hiểu',
      onPrimaryCTAClick: handleBottomSheetClose,
    },
    2: {
      title: 'Điều khoản và điều kiện',
      content: (
        <p className="text-label-md">
          Truy cập vào{' '}
          <a
            className="text-blue-500"
            href="https://play.google.com/vn-card-terms"
            rel="noopener noreferrer"
            target="_blank"
          >
            play.google.com/vn-card-terms
          </a>{' '}
          để xem toàn bộ điều khoản. Người dùng phải từ 15 tuổi trở lên và cư trú tại Việt Nam. Mã
          thẻ Google Play do Google Arizona LLC (“GAZ”) phát hành. Bạn cần có Tài khoản thanh toán
          Google và kết nối Internet để đổi Mã thẻ. Google Payment Corp. (“GPC”), một công ty liên
          kết của GAZ, sẽ giúp bảo quản số dư bạn đã đổi được từ Mã thẻ trong Tài khoản thanh toán
          Google của bạn. Mã thẻ chỉ có thể được dùng để mua các mặt hàng đủ điều kiện trên Google
          Play. Mã thẻ không thể được dùng để mua phần cứng và một số gói đăng ký nhất định. Các
          giới hạn khác có thể được áp dụng đối với Mã thẻ. Mã thẻ không mất phí và không có ngày
          hết hạn. Trừ trường hợp pháp luật quy định, Mã thẻ không thể quy đổi thành tiền mặt hoặc
          các loại thẻ khác, không thể sử dụng lại hoặc không thể được hoàn tiền; không thể kết hợp
          Mã thẻ với số dư khác không thuộc Google Play trong Tài khoản thanh toán Google của bạn,
          không thể bán lại, trao đổi hay chuyển nhượng để thu về giá trị. Người dùng chịu trách
          nhiệm khi làm mất Mã thẻ. Để được trợ giúp hoặc để xem số dư trong Mã thẻ Google Play của
          bạn, hãy truy cập vào{' '}
          <a
            className="text-blue-500"
            href="https://support.google.com/googleplay/go/cardhelp"
            rel="noopener noreferrer"
            target="_blank"
          >
            support.google.com/googleplay/go/cardhelp
          </a>
          . Để nói chuyện với nhân viên chăm sóc khách hàng, hãy gọi cho chúng tôi theo số
          1-855-466-4438.
        </p>
      ),
    },
  }
  const activeSheetContent = sheets[activeSheet]

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-between rounded-lg bg-other-background px-4 py-3"
        onClick={handleBottomSheetOpen}
      >
        <div className="flex items-center">
          <span className={styles.infoIcon} />
          Hướng dẫn sử dụng
        </div>

        <span className={styles.arrowNextIcon} />
      </div>

      <BottomSheet
        visible={visible}
        title={activeSheetContent.title}
        leftIcon={
          activeSheet !== 1 && (
            <span className={styles.backIcon} onClick={() => setActiveSheet(1)} />
          )
        }
        onClose={handleBottomSheetClose}
        primaryCTAText={activeSheetContent.primaryCTAText}
        onPrimaryCTAClick={activeSheetContent.onPrimaryCTAClick}
      >
        {activeSheetContent.content}
      </BottomSheet>
    </>
  )
}
