import Checkbox from '../../../../components/checkbox'
import expandArrow from '../../../../../../../public/images/icons/expand_arrow.svg'
import Image from '@/components/common/image'
import { useEffect, useState } from 'react'
import close from '../../../../../../../public/images/icons/close.svg'
interface PolicyProps {
  onChange?: (checked: boolean) => void
  isChecked: boolean
}
const Policy = ({ onChange, isChecked }: PolicyProps) => {
  const [expanding, setExpand] = useState(false)

  useEffect(() => {
    if (expanding) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [expanding])

  const onChangePolicy = () => {
    onChange && onChange(!isChecked)
  }

  const onExpand = () => {
    setExpand(true)
  }

  const onClose = () => {
    setExpand(false)
  }

  return (
    <>
      <div className="z-9 mb-[8px] mt-3 flex justify-between">
        <div className="text-base font-bold">Điều khoản thanh toán</div>
        <div onClick={onExpand} className="flex items-center">
          <Image src={expandArrow} alt="" className="h-[16px] w-[16px]" />
          <div className="ml-[4px] text-sm font-normal text-[#FF8302]">Mở rộng</div>
        </div>
      </div>
      <div>
        <iframe
          src={`https://scdn.zalopay.com.vn/zst/zpi/images/bill/file/uts-policy.pdf`}
          style={{ width: '100%', height: '64.3px' }}
        ></iframe>
      </div>
      <div>
        <Checkbox
          value={isChecked}
          isChecked={isChecked}
          label="Tôi đồng ý với Chính sách thanh toán phí của UTS"
          onChange={onChangePolicy}
        />
      </div>
      {expanding && (
        <div className="fixed inset-0 z-[9] flex items-center justify-center bg-[rgba(0,0,0,0.2)]">
          <div className="relative h-[70%] w-[70%] bg-white">
            <div className="py-2 text-center font-bold">Điều khoản thanh toán</div>
            <div onClick={onClose} className="absolute right-[16px] top-[12px]">
              <Image src={close} alt="" />
            </div>
            <iframe
              src={`https://scdn.zalopay.com.vn/zst/zpi/images/bill/file/uts-policy.pdf`}
              style={{ width: '100%', height: '100%' }}
            ></iframe>
          </div>
        </div>
      )}
    </>
  )
}
export default Policy
