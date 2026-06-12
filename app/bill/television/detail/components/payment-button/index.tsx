import billAPI from '@/api-client/bill'
import ErrorContext from '@/app/bill/error-context'
import Button, { ButtonSize } from '@/components/common/button'
import { IBillInfo } from '@/types/bill'
import commonUtil from '@/utils/common'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'

interface PaymentButtonProps {
  billInfo: IBillInfo
}
export default function PaymentButton({ billInfo }: PaymentButtonProps) {
  const { appID, handleError } = useContext(ErrorContext)
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  const {
    handleSubmit,
    formState: { errors },
  } = useFormContext()

  const isEmptyBills = commonUtil.isEmpty(billInfo.bills)
  let isSubmitting = false

  const handlePaymentClick = handleSubmit(async (data) => {
    if (isEmptyBills || isSubmitting) {
      location.replace('/truyen-hinh')
      return
    }
    isSubmitting = true
    const bills = data.bills
    if (data.amount && bills?.length) {
      bills[0].amount = parseInt(commonUtil.formatNumber(data.amount), 10)
    }
    const order = {
      email: data.email,
      description: '',
      items: {
        bill_items: {
          app_id: billInfo.appID,
          supplier_id: billInfo.supplierID,
          provider_code: billInfo.providerCode,
          customer_code: billInfo.customerCode,
          customer_name: billInfo.customerName,
          customer_address: billInfo.address,
          bills,
        },
      },
    }
    try {
      await billAPI
        .createOrder({
          appId: appID,
          order,
          voucherCode: data.voucherCode || '',
          utmSource: utmSource,
        })
        .then((resp: any) => {
          window.location.href = resp.order_url
        })
    } catch (_error: any) {
      handleError(_error)
    }
    isSubmitting = false
  })

  const handleErrorClick = () => {
    location.replace('/truyen-hinh')
    console.log('handleErrorClick', errors)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white-500 p-4 md:static md:p-0">
        <Button
          width="w-full"
          size={ButtonSize.LARGE}
          isDisabled={!!errors['period_bills']}
          onClick={errors['period_bills'] ? handleErrorClick : handlePaymentClick}
        >
          {isEmptyBills ? 'Đóng' : 'Thanh toán'}
        </Button>
      </div>
    </>
  )
}
