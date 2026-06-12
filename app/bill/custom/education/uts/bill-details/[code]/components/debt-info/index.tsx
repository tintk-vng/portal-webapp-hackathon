import { convertAmountStringToInt } from '@/app/bill/consumer-finance/utils'
import Image from '@/components/common/image'
import Input, { InputStatus } from '../../../../components/input'
import { EducationBillInfo } from '@/types/bill/education'
import commonUtil from '@/utils/common'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import PaymentBillArtwork from '../../../../../../../../../public/images/artworks/payment_bill.svg'
interface DebtInfoProps {
  billInfo: EducationBillInfo
  inputError?: string
  onChange?: () => void
}

const DebtInfo = ({ billInfo, inputError, onChange = () => {} }: DebtInfoProps) => {
  const [amount, setInputAmount] = useState('')
  const { setValue } = useFormContext()
  if (commonUtil.isEmpty(billInfo)) {
    return null
  }
  const { paymentRule, totalAmount, bills } = billInfo

  const onInputAmount = (e: any) => {
    const NON_NUMBER_REGEX = /[^0-9\.]/g
    let value = e.replace(NON_NUMBER_REGEX, '').replace('.', '')
    setInputAmount(value)
    const parsedValue = isNaN(Number(value)) ? 0 : Number(value)
    setValue('amount', parsedValue)
    onChange()
  }

  const onBlurInputAmount = () => {
    let value = convertAmountStringToInt(amount || '0')
    if (value > 0) {
      setInputAmount(commonUtil.formatCurrency(value))
    } else {
      setInputAmount('')
    }
  }

  const onClearInputAmount = () => {
    setInputAmount('')
  }

  const onFocusInputAmount = () => {
    if (amount === '') {
      setInputAmount('')
    } else {
      const NON_NUMBER_REGEX = /[^0-9\.]/g
      let value = amount.replace(NON_NUMBER_REGEX, '')
      setInputAmount(convertAmountStringToInt(value).toString())
    }
  }

  if (commonUtil.isEmpty(billInfo?.bills)) {
    return (
      <div className="mb-6 mt-9 md:mb-9">
        <div className="mb-2 flex flex-col items-center md:mb-3">
          <Image
            className="m-auto mb-1 h-[60px] w-[60px] md:mb-4 md:h-[180px] md:w-[180px]"
            src={'https://scdn.zalopay.com.vn/zst/zpi/images/bill/portal/artworks/payment_bill.svg'}
            width={180}
            height={180}
            alt="payment-bill-artwork"
          />

          <div className="text-heading-lg">Chưa tới kỳ thanh toán</div>
        </div>

        <div className="flex justify-center text-center text-label-md text-dark-300 md:text-xl">
          Bạn có thể chọn thanh toán hoá đơn của các dịch vụ khác bên cạnh nhé.
        </div>
      </div>
    )
  }

  return (
    <div className="mb-[24px] mt-9">
      <div className="mb-[8px] text-base font-bold">Số tiền thanh toán</div>
      <Input
        styleColor="orange-550"
        className="w-full"
        onChange={onInputAmount}
        onBlur={onBlurInputAmount}
        onFocus={onFocusInputAmount}
        onClear={onClearInputAmount}
        value={amount}
        placeholder={'Vui lòng nhập số tiền'}
        message={inputError}
        status={InputStatus.ERROR}
      />
    </div>
  )
}

export default DebtInfo
