'use client'

import commonAPI from '@/api-client/common'
import Skeleton from '@/components/common/skeleton'
import ErrorBoundary from '@/components/layout/error-boundary'
import { ProductID as BillProductID } from '@/constants/bill'
import { TransactionStatus } from '@/constants/common'
import { ProductID as TelcoProductID } from '@/constants/telco'
import transactionModel from '@/models/common/transaction'
import { Transaction } from '@/types/common'
import commonUtil from '@/utils/common'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const BillTransaction = dynamic(() => import('./bill'), {
  loading: Loading,
})
const TelcoTransaction = dynamic(() => import('./telco'), {
  loading: Loading,
})

function Loading() {
  return (
    <div className="flex flex-col items-center pt-6 text-label-md md:py-3 md:text-label-lg">
      <Skeleton className="h-[80px] w-[80px] rounded-full md:mb-4" />
      <div className="flex w-full flex-col items-center gap-y-2 px-8 pb-4 pt-6 md:gap-y-3 md:p-0">
        <Skeleton className="h-5 w-1/3 rounded-full md:mb-4 md:h-8" />
        <Skeleton className="h-[18px] w-2/3 rounded-full md:mb-4 md:h-7" />
      </div>
    </div>
  )
}

export default function TransactionDetail() {
  const [isLoading, setIsLoading] = useState(true) // tracking lần đầu api trả về để dừng hiện UI Loading
  const [transaction, setTransaction] = useState({} as Transaction)
  let isGettingTransaction = false // flag để không gọi api khi chưa có response của lần gọi trước, tránh hit liên tục lên server; vì việc gọi api đang để trong interval.
  let isFinalTransactionStatusTaken = false

  // productID đang có kiểu number nên đặt giá trị default là 0
  const productIDParams = commonUtil.getParameterByName('product_id') ?? '0'
  // xử lý việc trong param product_id có dấu ? vd: product_id=61?appid=61
  const productID = parseInt(productIDParams.split('?')[0], 10)
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
      console.log('Lỗi trang kết quả: ', error)
    }
    setIsLoading(false)
    isGettingTransaction = false
  }

  useEffect(() => {
    const maxRetryGetTransaction = 3
    let countGetTransaction = 0
    let intervalGetTransaction = setInterval(async () => {
      const isAllowedRetry =
        countGetTransaction < maxRetryGetTransaction && !isFinalTransactionStatusTaken
      if (!isGettingTransaction && isAllowedRetry && !!productID) {
        countGetTransaction++
        await getTransDetail()
      }
      if (!isAllowedRetry) {
        clearInterval(intervalGetTransaction)
      }
    }, 3000)
    return () => clearInterval(intervalGetTransaction)
  }, [])

  function renderTransactionDetail() {
    if (isLoading) {
      return <Loading />
    }
    // app cha tổng quát của cả line -> dùng product_id
    if (Object.values(TelcoProductID).includes(productID)) {
      return (
        <TelcoTransaction
          productID={productID}
          transaction={transaction}
          paymentStatus={paymentStatus}
        />
      )
    }
    if (Object.values(BillProductID).includes(productID)) {
      return (
        <BillTransaction
          productID={productID}
          transaction={transaction}
          paymentStatus={paymentStatus}
        />
      )
    }
    return (
      <BillTransaction
        productID={productID as BillProductID}
        transaction={transaction}
        paymentStatus={paymentStatus}
      />
    )
  }

  return (
    <ErrorBoundary>
      <div className="mb-6 hidden text-2xl font-bold md:block">Kết quả giao dịch</div>
      <div className="mx-auto mb-8 max-w-[752px] md:mb-0">{renderTransactionDetail()}</div>
    </ErrorBoundary>
  )
}
