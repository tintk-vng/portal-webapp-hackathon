'use client'

import commonAPI from '@/api-client/common'
import ErrorBoundary from '@/components/layout/error-boundary'
import { TransactionStatus } from '@/constants/common'
import { ProductID } from '@/constants/telco'
import transactionModel from '@/models/common/transaction'
import { Transaction } from '@/types/common'
import commonUtil from '@/utils/common'
import { useEffect, useState } from 'react'
import LoadingState from './_components/loading-state'
import TransactionDetails from './_components/transaction-details'

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [transaction, setTransaction] = useState({} as Transaction)
  let isGettingTransaction = false
  let isFinalTransactionStatusTaken = false

  const productID = ProductID.GAME
  let paymentStatus = TransactionStatus.PROCESSING
  const paymentParams = commonUtil.getParameterByName('status')
  if (paymentParams) {
    paymentStatus = parseInt(paymentParams, 10)
    paymentStatus = paymentStatus < 0 ? TransactionStatus.FAIL : paymentStatus
  }

  async function getTransDetail() {
    if (isGettingTransaction) {
      return
    }
    isGettingTransaction = true
    try {
      const appID = commonUtil.getParameterByName('appid')
      const transactionID = commonUtil.getParameterByName('apptransid')
      const amount = commonUtil.getParameterByName('amount') || ''
      const discountAmount = commonUtil.getParameterByName('discountamount') || ''
      const checksum = commonUtil.getParameterByName('checksum') || ''
      const bankCode = commonUtil.getParameterByName('bankcode') || ''
      const pmcID = commonUtil.getParameterByName('pmcid') || ''
      const status = commonUtil.getParameterByName('status') || ''

      if (!appID || !transactionID) {
        throw new Error('Missing data')
      }

      const data = await commonAPI.getTransactionByTransactionID({
        productID,
        appID,
        transactionID,
        amount,
        discountAmount,
        checksum,
        bankCode,
        pmcID,
        status,
      })
      const newTransaction = transactionModel.modelTransaction(data, productID)

      if (!commonUtil.isEmpty(newTransaction)) {
        if (paymentStatus === TransactionStatus.FAIL) {
          newTransaction.customData.status = 'FAIL'
        }
        isFinalTransactionStatusTaken = [
          TransactionStatus.SUCCESS,
          TransactionStatus.FAIL,
        ].includes(newTransaction.status)
        setTransaction(newTransaction)
      }
    } catch (error) {
      console.log('Failed to get transaction details: ', error)
    }
    setIsLoading(false)
    isGettingTransaction = false
  }

  useEffect(() => {
    const maxRetryGetTransaction = 10
    let countGetTransaction = 0
    const intervalGetTransaction = setInterval(async () => {
      const isAllowedRetry =
        countGetTransaction < maxRetryGetTransaction && !isFinalTransactionStatusTaken
      if (!isGettingTransaction && isAllowedRetry) {
        countGetTransaction++
        await getTransDetail()
      }
      if (!isAllowedRetry) {
        clearInterval(intervalGetTransaction)
      }
    }, 2000)
    return () => clearInterval(intervalGetTransaction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ErrorBoundary>
      <div className="mb-6 hidden text-2xl font-bold md:block">Kết quả giao dịch</div>

      <div className="mx-auto mb-8 max-w-[752px] md:mb-0">
        {isLoading ? (
          <LoadingState />
        ) : (
          <TransactionDetails transaction={transaction} paymentStatus={paymentStatus} />
        )}
      </div>
    </ErrorBoundary>
  )
}
