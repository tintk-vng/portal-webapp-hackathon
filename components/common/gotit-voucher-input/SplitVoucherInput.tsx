import commonAPI from '@/api-client/common'
import { ProductID as BillProductID } from '@/constants/bill'
import { ProductID as TelcoProductID } from '@/constants/telco'
import commonModel from '@/models/common'
import { Voucher } from '@/types/common'
import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import Button, { ButtonSize, ButtonType } from '../button'
import Image from '../image'
import Input from '../input'

export interface SplitVoucherInputProps {
  productID: TelcoProductID | BillProductID
  voucher: Voucher
  onVoucherFetch: Function
}

function Main({ productID, voucher, onVoucherFetch }: SplitVoucherInputProps) {
  const searchParams = useSearchParams()
  const { setValue } = useFormContext()
  const [splitValue, setSplitValue] = useState<string>('')
  const [isSplitted, setIsSplitted] = useState<boolean>(false)
  const [splitErrorMessage, setSplitErrorMessage] = useState<string>('')
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleVoucherSplit = async () => {
    try {
      splitErrorMessage && setSplitErrorMessage('')
      if (!splitValue) {
        setSplitErrorMessage('Bạn chưa nhập giá trị voucher')
        return
      }
      if (Number(splitValue) % 1000 !== 0) {
        setSplitErrorMessage('Giá trị voucher phải chia hết cho 1.000')
        return
      }
      const voucherToken = searchParams?.get('voucherToken') || ''
      if (!voucherToken) {
        throw new Error('Tách voucher không thành công')
      }
      const data = await commonAPI.splitVoucher({ productID, voucherToken, voucher, splitValue })
      const splittedVoucher = commonModel.modelVoucher(data)
      setValue('voucherCode', splittedVoucher.code)
      onVoucherFetch()
      setIsSplitted(true)
    } catch (error: any) {
      console.log('Failed to split voucher: ', error)
      setSplitErrorMessage(error.response?.data.error.detail.description || error.message)
    }
  }

  const handleSplittingCancel = () => {
    setValue('voucherCode', '')
    setSplitValue('')
    setIsSplitted(false)
  }

  const handleSplitValueChange = (value: string) => {
    splitErrorMessage && setSplitErrorMessage('')
    const formattedValue = commonUtil.formatNumber(value)
    if (Number(formattedValue) > voucher.value) {
      setSplitErrorMessage(
        `Giá trị tối đa bạn có thể nhập là ${commonUtil.formatCurrency(voucher.value)}`
      )
    }
    // commonUtil.trackEvent({
    //   ID: EVENT[appID].INPUT_CAPTCHA,
    //   metaData: { captcha: formattedValue },
    // })
    setSplitValue(formattedValue)
  }

  return (
    <div className="mt-3 rounded-lg border border-dark-50">
      <div className="flex h-12 items-center justify-between bg-dark-25 p-3 md:h-[68px] md:px-6 md:py-4">
        <div className="flex h-full items-end space-x-1 md:space-x-3">
          <label className="text-label-md md:text-xl md:font-bold">Bạn đang có voucher</label>

          <Image
            className="h-full w-auto"
            src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/gotit.svg"
            alt="got-it-logo"
          />
        </div>

        <label className="text-label-lg font-bold md:text-xl">
          {voucher.value !== 0 && commonUtil.formatCurrency(voucher.value)}
        </label>
      </div>

      <div className="bg-[url('https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks/mobile_voucher.png')] bg-contain bg-bottom bg-no-repeat px-3 pb-[72px] pt-4 md:bg-[url('https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks/voucher.png')] md:bg-right-bottom md:p-6 md:pb-6">
        {isSplitted ? (
          <label className="text-label-md text-green-500 md:text-xl md:font-normal">
            Bạn sẽ được giảm <b>{commonUtil.formatCurrency(Number(splitValue))}</b> khi thanh toán
          </label>
        ) : (
          <label className="text-label-md font-bold md:text-xl md:font-normal">
            Nhập giá trị voucher bạn muốn sử dụng
          </label>
        )}

        <div className="mt-3 flex">
          {/* <Controller
                control={control}
                name="voucherValue"
                // rules={{
                //   required: 'Bạn chưa nhập mã xác nhận',
                // }}
                defaultValue={isSplitted ? voucher.value : ''}
                render={({ field: { value, onChange, ref }, fieldState: { error } }) => ( */}
          <Input
            className="mr-3 h-full flex-1 bg-white-500 md:mr-4 md:max-w-md"
            height="md:h-[60px]"
            value={isFocused ? splitValue : commonUtil.formatCurrency(Number(splitValue))}
            placeholder="Giá trị chia hết cho 1.000"
            maxLength={12}
            disabled={isSplitted}
            onChange={handleSplitValueChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {isSplitted ? (
            <Button
              size={ButtonSize.LARGE}
              type={ButtonType.NEGATIVE}
              bold={false}
              height="h-[52px] md:h-[62px]"
              onClick={handleSplittingCancel}
            >
              Huỷ bỏ
            </Button>
          ) : (
            <Button
              size={ButtonSize.LARGE}
              height="h-[52px] md:h-[62px]"
              onClick={handleVoucherSplit}
            >
              Xác nhận
            </Button>
          )}
        </div>

        <div
          className={classNames({
            'mt-1 text-label-lg text-dark-300': true,
            'text-red-500': !!splitErrorMessage,
          })}
        >
          {splitErrorMessage ||
            (!isSplitted && (
              <>
                Bấm <b>Xác nhận</b> để tách Voucher. Voucher đã tách sẽ được áp dụng tại bước thanh
                toán.
              </>
            ))}
        </div>
      </div>
    </div>
  )
}

export default function SplitVoucherInput(props: SplitVoucherInputProps) {
  return (
    <Suspense fallback={null}>
      <Main {...props} />
    </Suspense>
  )
}
