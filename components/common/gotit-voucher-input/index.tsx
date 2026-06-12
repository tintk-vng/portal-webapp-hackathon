import commonAPI from '@/api-client/common'
import { ProductID as BillProductID } from '@/constants/bill'
import { VoucherType } from '@/constants/common'
import { ProductID as TelcoProductID } from '@/constants/telco'
import commonModel from '@/models/common'
import { Voucher } from '@/types/common'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

const SplitVoucherInput = dynamic(() => import('./SplitVoucherInput'))
const VoucherInform = dynamic(() => import('./VoucherInform'))
const Toast = dynamic(() => import('../toast'))

export interface GotItVoucherInputProps {
  productID: TelcoProductID | BillProductID
}

function Main({ productID }: GotItVoucherInputProps) {
  const searchParams = useSearchParams()
  const { setValue } = useFormContext()
  const [voucher, setVoucher] = useState<Voucher>({} as Voucher)
  const [toastState, setToastState] = useState<{
    isVisible: boolean
    message: string
  }>({
    isVisible: false,
    message: '',
  })

  const handleVoucherFetch = async () => {
    try {
      const encrypt = searchParams?.get('encrypt') || ''
      if (!encrypt) {
        return
      }
      const data = await commonAPI.getVoucher({ productID, encrypt })
      const fetchedVoucher = commonModel.modelVoucher(data)
      if (fetchedVoucher.value === 0) {
        return
      }
      setVoucher(fetchedVoucher)
      fetchedVoucher.type === VoucherType.V && setValue('voucherCode', fetchedVoucher.code)
      setToastState({
        isVisible: true,
        message: commonUtil.isEmpty(voucher)
          ? 'Bạn đang có voucher Got It và sẽ được áp dụng tại bước thanh toán'
          : 'Tách voucher thành công',
      })
    } catch (error) {
      console.log('Failed to get voucher: ', error)
      setVoucher({} as Voucher)
    }
  }

  useEffect(() => {
    handleVoucherFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (commonUtil.isEmpty(voucher)) {
    return null
  }

  const isEType = voucher.type === VoucherType.E

  return (
    <div className="mb-6 mt-4">
      {isEType ? (
        <SplitVoucherInput
          productID={productID}
          voucher={voucher}
          onVoucherFetch={handleVoucherFetch}
        />
      ) : (
        <VoucherInform />
      )}

      <Toast
        iconURL="https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/gotit.svg"
        visible={toastState.isVisible}
        message={toastState.message}
        onClose={() =>
          setToastState({
            isVisible: false,
            message: '',
          })
        }
      />
    </div>
  )
}

export default function GotItVoucherInput(props: GotItVoucherInputProps) {
  return (
    <Suspense fallback={null}>
      <Main {...props} />
    </Suspense>
  )
}
