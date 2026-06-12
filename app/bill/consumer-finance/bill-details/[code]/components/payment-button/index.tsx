import billApi from '@/api-client/bill'
import Dialog from '@/app/bill/components/dialog'
import ErrorContext from '@/app/bill/error-context'
import Button, { ButtonSize, ButtonType } from '@/components/common/button'
import { AppID, PaymentType, SupplierID } from '@/constants/bill'
import { IActionDialog, IBillInfo } from '@/types/bill'
import { IPaymentSelection } from '@/types/bill/consumer-finance'
import commonUtil from '@/utils/common'
import { useSearchParams } from 'next/navigation'
import { useContext, useState } from 'react'
import { useFormContext } from 'react-hook-form'
interface PaymentButtonProps {
  billInfo: IBillInfo
  selectingPaymentOpt?: IPaymentSelection | null
}
export default function PaymentButton({ billInfo, selectingPaymentOpt }: PaymentButtonProps) {
  const { handleError } = useContext(ErrorContext)
  const { handleSubmit } = useFormContext()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  const isEmptyBills =
    commonUtil.isEmpty(billInfo.bills) || billInfo.bills[0].installment?.max_input === 0
  let isSubmitting = false
  const [dialogVisible, setDialogVisible] = useState(false)
  const [dialogValue, setDialogValue] = useState<{
    title: string
    description: any
    actions: Array<IActionDialog>
  }>({
    title: '',
    description: '',
    actions: [],
  })

  const handlePaymentClick = handleSubmit(async (data) => {
    isSubmitting = true
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
          bills:
            billInfo.paymentRule === PaymentType.PayAll
              ? billInfo.bills
              : [{ ...billInfo.bills[0], amount: data.amount }],
        },
      },
    }
    await billApi
      .createOrder({
        appId: AppID.CONSUMER_FINANCE,
        order,
        voucherCode: data.voucherCode || '',
        utmSource: utmSource,
      })
      .then((resp: any) => {
        window.location.href = resp.order_url
      })
      .catch((err: any) => {
        handleError(err)
      })
    isSubmitting = false
  })

  const onPaymentClick = () => {
    if (isEmptyBills || isSubmitting) {
      location.replace('/vay-tieu-dung')
      return
    }
    if (selectingPaymentOpt?.value === -1) {
      return
    }

    if (
      billInfo.bills[0].installment?.min_pay &&
      selectingPaymentOpt &&
      selectingPaymentOpt?.value < billInfo.bills[0].installment?.min_pay &&
      !SuppliersMinAmountNonRealtime.includes(billInfo.supplierID)
    ) {
      setDialogValue({
        title: 'Số tiền bạn nhập nhỏ hơn mức thanh toán tối thiểu',
        description: (
          <label>
            Bạn cần thanh toán thêm{' '}
            <b>
              {commonUtil.formatCurrency(
                (billInfo.bills[0].installment?.min_pay || 0) - (selectingPaymentOpt?.value || 0)
              )}
            </b>{' '}
            trước ngày <b>{billInfo.bills[0].expired_date || ''}</b> để tiếp tục dùng thẻ
          </label>
        ),
        actions: [
          { title: 'Tiếp tục', action: onContinuePay, type: ButtonType.SECONDARY },
          { title: 'Chọn lại', action: onCancle, type: ButtonType.PRIMARY },
        ],
      })
      setDialogVisible(true)
    } else if (selectingPaymentOpt && selectingPaymentOpt?.value > billInfo.bills[0].amount) {
      setDialogValue({
        title: '',
        description: (
          <label>
            Số tiền dư{' '}
            <b>
              {commonUtil.formatCurrency(
                (selectingPaymentOpt?.value || 0) - billInfo.bills[0].amount
              )}
            </b>{' '}
            sẽ được cộng cho lần thanh toán tiếp theo hoặc trừ vào tổng dư nợ tùy theo nhà cung cấp
          </label>
        ),
        actions: [
          { title: 'Huỷ', action: onCancle, type: ButtonType.SECONDARY },
          { title: 'Đồng ý', action: onContinuePay, type: ButtonType.PRIMARY },
        ],
      })
      setDialogVisible(true)
    } else {
      handlePaymentClick()
    }
  }

  const onContinuePay = () => {
    handlePaymentClick()
    setDialogVisible(false)
  }

  const onCancle = () => {
    setDialogVisible(false)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white-500 p-4 md:static md:p-0">
        <Button width="w-full" size={ButtonSize.LARGE} onClick={onPaymentClick}>
          {isEmptyBills ? 'Đóng' : 'Thanh toán'}
        </Button>
      </div>
      <Dialog
        title={dialogValue.title}
        subtitle={dialogValue.description}
        actions={dialogValue.actions}
        visible={dialogVisible}
        onClose={onCancle}
      />
    </>
  )
}

const SuppliersMinAmountNonRealtime = [SupplierID.SHBCard]
