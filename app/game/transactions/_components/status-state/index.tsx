'use client'

import StaticImage from '@/components/common/static-image'
import { EVENT, TransactionStatus } from '@/constants/common'
import { Transaction } from '@/types/common'
import commonUtil from '@/utils/common'
import { useEffect } from 'react'

function generateStatusState(paymentStatus: TransactionStatus, transaction: Transaction) {
  const { status: providerStatus = TransactionStatus.PROCESSING, email = '' } = transaction
  if (providerStatus === TransactionStatus.FAIL) {
    return {
      imageSrc: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/failure.svg',
      title: 'Giao dịch thất bại',
      description: 'Giao dịch thất bại, Zalopay đã hoàn tiền về cho bạn.',
    }
  }
  if (providerStatus === TransactionStatus.SUCCESS) {
    return {
      imageSrc: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/success.svg',
      title: 'Giao dịch thành công',
      description: `Kết quả thanh toán và mã thẻ đã được Zalopay gửi đến email ${email} (Hộp thư chính/Spam)`,
    }
  }
  if (paymentStatus === TransactionStatus.FAIL) {
    return {
      imageSrc: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/failure.svg',
      title: 'Giao dịch thất bại',
      description: 'Giao dịch thất bại, bạn vui lòng thực hiện lại nhé.',
    }
  }
  return {
    imageSrc: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/pending.svg',
    title: 'Giao dịch đang xử lý',
    description: `Kết quả thanh toán và mã thẻ đã được Zalopay gửi đến email ${email} (Hộp thư chính/Spam)`,
  }
}

interface StatusStateProps {
  paymentStatus: TransactionStatus
  transaction: Transaction
}

export default function StatusState({ paymentStatus, transaction }: StatusStateProps) {
  useEffect(() => {
    setTimeout(() => {
      commonUtil.trackEvent({
        ID: EVENT.RESULT_PAGE.LOAD_PAGE,
        metaData: { transaction_status: statusState.title },
      })
    }, 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusState = generateStatusState(paymentStatus, transaction)

  return (
    <div className="flex flex-col items-center pt-6 text-label-md md:py-3 md:text-label-lg">
      <StaticImage
        className="md:mb-4"
        src={statusState.imageSrc}
        width={80}
        height={80}
        alt="state-view-artwork"
        loader={({ src }) => src}
      />

      <div className="flex flex-col gap-y-2 px-8 pb-4 pt-6 text-center md:gap-y-3 md:p-0">
        <div className="text-label-lg font-bold md:text-2xl">{statusState.title}</div>

        {statusState.description.length > 0 && (
          <div className="text-dark-300 md:text-xl">{statusState.description}</div>
        )}
      </div>
    </div>
  )
}
