'use client'

import { TransactionStatus } from '@/constants/common'
import { Transaction } from '@/types/common'
import commonUtil from '@/utils/common'
import CTAs from '../ctas'
import HorizontalVirtualCards from '../horizontal-virtual-cards'
import LineSteps from '../line-steps'
import StatusState from '../status-state'

function RowInfo({
  title,
  value,
  children,
}: {
  title?: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex gap-x-2.5 py-3 md:py-[18px]">
      {children ? (
        children
      ) : (
        <>
          <label className="w-full text-dark-300">{title}</label>

          <label className="w-full text-right">{value}</label>
        </>
      )}
    </div>
  )
}

interface CardTransactionsProps {
  transaction: Transaction
}

function CardTransactions({ transaction }: CardTransactionsProps) {
  const cards = Array.isArray(transaction.cards) ? transaction.cards : []
  const cardName = transaction.customData?.package_name || ''

  return (
    <div className="mt-4 md:mt-10 md:rounded-lg md:border md:border-dark-50 md:px-6 md:pb-3 md:pt-6">
      <HorizontalVirtualCards cards={cards} cardName={cardName} />

      <p className="mb-1 text-base font-bold md:mb-2">Thông tin giao dịch</p>

      <div className="divide-y divide-dark-50 text-label-md md:text-label-lg">
        <RowInfo title="Nhà cung cấp dịch vụ" value={transaction.customData?.supplier_name} />

        <RowInfo
          title="Mệnh giá thẻ"
          value={commonUtil.formatCurrency(transaction.customData?.unit_price)}
        />

        <RowInfo>
          <label className="w-1/3 text-dark-300">Email nhận thẻ</label>

          <label className="w-2/3 text-right">{transaction.email}</label>
        </RowInfo>

        <RowInfo>
          <label className="w-full text-dark-300">Tổng tiền đơn hàng</label>

          <label className="w-full text-right font-bold">
            {commonUtil.formatCurrency(transaction.amount)}
          </label>
        </RowInfo>
      </div>
    </div>
  )
}

interface TransactionDetailsProps {
  transaction: Transaction
  paymentStatus: TransactionStatus
}

export default function TransactionDetails({
  transaction,
  paymentStatus,
}: TransactionDetailsProps) {
  const isTransactionEmpty = commonUtil.isEmpty(transaction)

  return (
    <>
      <StatusState paymentStatus={paymentStatus} transaction={transaction} />

      <LineSteps paymentStatus={paymentStatus} transactionStatus={transaction.status} />

      {!isTransactionEmpty && <CardTransactions transaction={transaction} />}

      <CTAs transaction={transaction} />
    </>
  )
}
