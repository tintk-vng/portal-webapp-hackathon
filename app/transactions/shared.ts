import { EVENT, TransactionStatus } from '@/constants/common'
import { Transaction } from '@/types/common'
import commonUtil from '@/utils/common'
import { CallToActionProps } from './components/call-to-action'

function generateSupportURL(transaction: Transaction) {
  let url = process.env.NEXT_PUBLIC_ZLP_SUPPORT_URL + '/customer/gateway?source=payment-gateway'
  let moreInfoParam: any = {
    platform: 'DGS website',
  }
  if (!commonUtil.isEmpty(transaction)) {
    moreInfoParam = {
      ...moreInfoParam,
      app: transaction.appID,
      appTransID: transaction.appTransID,
      transactionEmail: transaction.email,
      note: '',
      amount: transaction.amount,
    }
    const customData = transaction.customData
    moreInfoParam.merchantStatus = customData.status
    moreInfoParam.paymentChannel = customData.payment_channel
    moreInfoParam = Object.fromEntries(
      Object.entries(moreInfoParam).filter(([_, value]) => value != null)
    )
  }
  moreInfoParam = JSON.stringify(moreInfoParam)
  moreInfoParam = btoa(unescape(encodeURIComponent(moreInfoParam)))
  url += `&more-info=${moreInfoParam}`
  return url
}

export function generateInitialCTA() {
  return {
    postIconLink: 'primaryArrowRightIcon',
  } as CallToActionProps
}

export function generateSupportCTA(transaction: Transaction): CallToActionProps {
  const supportURL = generateSupportURL(transaction)
  const initialCTA = generateInitialCTA()
  return {
    ...initialCTA,
    title: 'Yêu cầu hỗ trợ',
    onCTAClick: () => {
      supportURL && window.open(supportURL, '_blank')
    },
    preIconLink: 'supportIcon',
    event: {
      ID: EVENT.RESULT_PAGE.CLICK_SUPPORT,
    },
  }
}

// Pattern for description in StateView
export interface TransactionDescriptionFormat {
  paymentFail?: string
  providerFail?: string
  success?: string
  processing?: string
}

export function generateTransactionStateViewData(
  paymentStatus = TransactionStatus.PROCESSING,
  { status: providerStatus = TransactionStatus.PROCESSING, email = '' }: Transaction,
  descriptionFormat: TransactionDescriptionFormat = {}
) {
  const finalDescriptionFormat = Object.assign(
    {
      paymentFail: 'Giao dịch thất bại, bạn vui lòng thực hiện lại nhé.',
      providerFail: 'Giao dịch thất bại, Zalopay đã hoàn tiền về cho bạn.',
      success: 'Kết quả thanh toán đã được Zalopay gửi đến email',
      processing: 'Kết quả thanh toán đã được Zalopay gửi đến email',
    },
    descriptionFormat
  )
  if (providerStatus === TransactionStatus.FAIL) {
    return {
      image: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/failure.svg',
      title: 'Giao dịch thất bại',
      description: finalDescriptionFormat.providerFail,
    }
  }
  if (providerStatus === TransactionStatus.SUCCESS) {
    return {
      image: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/success.svg',
      title: 'Giao dịch thành công',
      description: `${finalDescriptionFormat.success} ${email} (Hộp thư chính/Spam)`,
    }
  }
  if (paymentStatus === TransactionStatus.FAIL) {
    return {
      image: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/failure.svg',
      title: 'Giao dịch thất bại',
      description: finalDescriptionFormat.paymentFail,
    }
  }
  return {
    image: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/pending.svg',
    title: 'Giao dịch đang xử lý',
    description: `${finalDescriptionFormat.processing} ${email} (Hộp thư chính/Spam)`,
  }
}
