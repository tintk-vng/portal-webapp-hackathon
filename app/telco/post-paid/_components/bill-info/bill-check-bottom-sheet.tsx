import { AppID, EVENT } from '@/constants/telco'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'

const BottomSheet = dynamic(() => import('@/components/common/bottom-sheet'))
const Modal = dynamic(() => import('@/components/common/modal'))

interface BillCheckBottomSheetProps {
  visible: boolean
  onClose: () => void
}

export default function BillCheckBottomSheet({ visible, onClose }: BillCheckBottomSheetProps) {
  const { size } = useScreen()

  const handleClose = () => {
    commonUtil.trackEvent({ ID: EVENT[AppID.POST_PAID].CLOSE_GUIDE_LINE_POPUP })
    onClose()
  }

  const handleUnderstoodClick = () => {
    commonUtil.trackEvent({ ID: EVENT[AppID.POST_PAID].CLICK_UNDERSTOOD_BUTTON })
    onClose()
  }

  return (
    <>
      {size === ScreenSize.SMALL && (
        <BottomSheet
          visible={visible}
          title="Hướng dẫn kiểm tra"
          onClose={handleClose}
          primaryCTAText="Đã hiểu"
          onPrimaryCTAClick={handleUnderstoodClick}
        >
          <label className="text-label-md">Kiểm tra cước miễn phí theo 2 cách:</label>

          <ul className="mt-4 space-y-4">
            <li className="flex items-center justify-between space-x-3">
              <span className="flex items-center">
                <span className="mr-3 flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 text-xs text-white-500">
                  1
                </span>

                <label className="text-label-md">
                  Soạn <b>TRACUOC</b> gửi <b>195</b>
                </label>
              </span>

              <a
                className="flex h-8 min-w-[70px] items-center justify-center rounded-md border border-blue-500 text-xs text-blue-500"
                href={
                  commonUtil.checkDevice().isIOS ? 'sms:195&body=TRACUOC' : 'sms:195?body=TRACUOC'
                }
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  commonUtil.trackEvent({
                    ID: EVENT[AppID.POST_PAID].CLICK_SEND_SMS_BUTTON,
                  })
                }
              >
                Gửi SMS
              </a>
            </li>

            <li className="flex items-center justify-between space-x-3">
              <span className="flex items-center">
                <span className="mr-3 flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 text-xs text-white-500">
                  2
                </span>

                <label className="text-label-md">
                  Bấm gọi <b>199</b>, bấm <b>phím 1</b> để nghe thông báo nợ cước
                </label>
              </span>

              <a
                className="flex h-8 min-w-[70px] items-center justify-center rounded-md border border-blue-500 text-xs text-blue-500"
                href="tel://199"
                onClick={() =>
                  commonUtil.trackEvent({
                    ID: EVENT[AppID.POST_PAID].CLICK_CALL_BUTTON,
                  })
                }
              >
                Gọi 199
              </a>
            </li>
          </ul>
        </BottomSheet>
      )}

      {size !== ScreenSize.SMALL && (
        <Modal
          visible={visible}
          size="sm"
          title="Hướng dẫn kiểm tra"
          onClose={handleClose}
          primaryCTAText="Đã hiểu"
          onPrimaryCTAClick={handleUnderstoodClick}
        >
          <label className="text-label-md font-bold">Kiểm tra cước miễn phí theo 2 cách:</label>

          <ul className="mt-4 space-y-4">
            <li>
              <span className="flex items-center">
                <span className="mr-3 flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 text-xs text-white-500">
                  1
                </span>

                <label className="text-label-md">
                  Soạn <b>TRACUOC</b> gửi <b>195</b>
                </label>
              </span>
            </li>

            <li>
              <span className="flex items-center">
                <span className="mr-3 flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 text-xs text-white-500">
                  2
                </span>

                <label className="text-label-md">
                  Bấm gọi <b>199</b>, bấm <b>phím 1</b> để nghe thông báo nợ cước
                </label>
              </span>
            </li>
          </ul>
        </Modal>
      )}
    </>
  )
}
