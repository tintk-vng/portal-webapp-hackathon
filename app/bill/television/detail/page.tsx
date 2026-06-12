'use client'
import CustomerInfo from '@/app/bill/components/customer-info'
import DebtInfo from '@/app/bill/components/debt-info'
import EmailInput from '@/app/bill/components/email-input'
import SupplierCard from '@/app/bill/components/supplier-card'
import { AppID, PaymentType, ProductID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import billModel from '@/models/bill'
import { useTelevisionStore } from '@/store/bill'
import { IBill } from '@/types/bill'
import { b64DecodeUnicode } from '@/utils/bill'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import SupplierHeader from '../../components/supplier-header'
import { SupplierIds } from '../const'
import BillDescription from './components/bill-description'
import KPlus from './components/k-plus'
import PaymentButton from './components/payment-button'
import PeriodSelections from './components/period-selections'
import PostpaidBill from './components/postpaid-bill'
import PrepaidBills from './components/prepaid-bills'
import GotItVoucherInput from '@/components/common/gotit-voucher-input'

const TELEVISION_HOME_PATH =
  MAPPED_PATH[Domain.BILL][AppID.CONSUMER_FINANCE]?.source || '/truyen-hinh'

type FormValues = {
  email: string
  phoneNumber: string
  bills: IBill[]
  voucherCode: string
}
export default function BillDetail() {
  const searchParams = useSearchParams()
  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
      phoneNumber: '',
      bills: [],
      voucherCode: '',
    } as FormValues,
  })
  const { supplier, billInfo } = useTelevisionStore()
  const supplierID = parseInt(searchParams?.get('supplierid') || '0', 10)
  const customerCode = b64DecodeUnicode(searchParams?.get('customercode') ?? '')
  const phoneNumber = telcoUtil.formatPhoneNumber(searchParams?.get('phonenumber') ?? '')
  const modeledBillInfo = billModel.modelBillInfo(billInfo)

  if (commonUtil.isEmpty(supplier) || commonUtil.isEmpty(billInfo)) {
    redirect(TELEVISION_HOME_PATH)
  }

  useEffect(() => {
    if (modeledBillInfo) {
      if (
        modeledBillInfo.paymentRule === PaymentType.PayAll ||
        modeledBillInfo.paymentRule === PaymentType.PayBySelectedPeriod
      ) {
        methods.setValue('bills', modeledBillInfo.bills)
      } else if (supplierID !== SupplierIds.KPlus) {
        methods.setValue('bills', [modeledBillInfo.bills[0]])
      }
    }
  }, [modeledBillInfo?.bills])

  const onGetDefaultPackage = (bill: IBill[]) => {
    methods.setValue('bills', bill)
  }

  return (
    <>
      <p className="mb-3 text-xl font-bold md:mb-6 md:text-2xl">Chi tiết hóa đơn</p>
      <div className="mb-3 flex flex-col gap-y-4 md:mb-0 md:p-6 md:shadow-[0_2px_12px_0] md:shadow-dark-500/5 ">
        {!commonUtil.isEmpty(supplier) && (
          <SupplierHeader supplier={supplier} alt="thanh-toan-cuoc-truyen-hinh-online" />
        )}
        <FormProvider {...methods}>
          {(() => {
            if (modeledBillInfo.bills.length > 0) {
              switch (modeledBillInfo.paymentRule) {
                case PaymentType.PrePaid:
                  if (modeledBillInfo.supplierID === SupplierIds.KPlus) {
                    return (
                      <KPlus billInfo={modeledBillInfo} onGetDefaultPackage={onGetDefaultPackage} />
                    )
                  }
                  return <PrepaidBills billInfo={modeledBillInfo} />
                case PaymentType.PostPaid:
                  return <PostpaidBill billInfo={modeledBillInfo} />
                case PaymentType.PayBySelectedPeriod:
                  return <PeriodSelections billInfo={modeledBillInfo} />
              }
            }
            return (
              <>
                <DebtInfo billInfo={modeledBillInfo} />
                <BillDescription
                  bills={modeledBillInfo.bills}
                  paymentRule={modeledBillInfo.paymentRule}
                />
              </>
            )
          })()}
          <CustomerInfo
            customerCode={modeledBillInfo.customerCode}
            phoneNumber={phoneNumber}
            customerName={modeledBillInfo.customerName}
            address={modeledBillInfo.address}
          />

          {!commonUtil.isEmpty(modeledBillInfo.bills) && (
            <FormProvider {...methods}>
              <EmailInput />

              <GotItVoucherInput productID={ProductID.TELEVISION} />
            </FormProvider>
          )}

          <PaymentButton billInfo={modeledBillInfo} />
        </FormProvider>
      </div>
    </>
  )
}
