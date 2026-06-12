import StaticImage from '@/components/common/static-image'
import { AppID, EVENT } from '@/constants/telco'
import useToggle from '@/hooks/use-toggle'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'

const BillCheckBottomSheet = dynamic(() => import('./bill-check-bottom-sheet'))

export default function BillCheck() {
  const [visible, toggle] = useToggle()

  const handleCheckClick = () => {
    commonUtil.trackEvent({ ID: EVENT[AppID.POST_PAID].CLICK_CHECK_GUIDE_LINE })
    toggle()
  }

  return (
    <>
      <div className="flex items-center" onClick={handleCheckClick}>
        <label className="cursor-pointer text-label-md text-blue-500">Kiểm tra</label>

        <StaticImage
          src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/info.svg"
          width={16}
          height={16}
          alt="info-icon"
          style={{ marginLeft: 4 }}
        />
      </div>

      {visible && <BillCheckBottomSheet visible={visible} onClose={toggle} />}
    </>
  )
}
