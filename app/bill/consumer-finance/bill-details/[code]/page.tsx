'use client'
import CustomerInfo from '@/app/bill/components/customer-info'
import EmailInput from '@/app/bill/components/email-input'
import SupplierHeader from '@/app/bill/components/supplier-header'
import { AppID, CFContractType, PaymentType, ProductID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import billModel from '@/models/bill'
import { useConsumerFinanceStore } from '@/store/bill'
import { IPaymentSelection } from '@/types/bill/consumer-finance'
import { b64DecodeUnicode } from '@/utils/bill'
import commonUtil from '@/utils/common'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import BillDescription from './components/bill-description'
import DebtInfo from './components/debt-info'
import PaymentButton from './components/payment-button'
import GotItVoucherInput from '@/components/common/gotit-voucher-input'
import BillInstallment from './components/bill-installment'
import consumerFinanceModel from '@/models/bill/consumer-finance'

const CONSUMER_FINANCE_HOME_PATH =
  MAPPED_PATH[Domain.BILL][AppID.CONSUMER_FINANCE]?.source || '/vay-tieu-dung'

type FormValues = {
  email: string
  amount: number
  voucherCode: string
}
export default function BillDetail() {
  const searchParams = useSearchParams()
  const supplierID = parseInt(searchParams?.get('supplierid') || '0', 10)
  const customerCode = b64DecodeUnicode(searchParams?.get('customercode') ?? '')
  const { billInfo, supplier } = useConsumerFinanceStore()
  if (commonUtil.isEmpty(supplier) || commonUtil.isEmpty(billInfo)) {
    redirect(CONSUMER_FINANCE_HOME_PATH)
  }
  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
      amount: 0,
      voucherCode: '',
    } as FormValues,
  })
  const modeledBillInfo = consumerFinanceModel.modelBillInfo(billInfo)
  const [paymentSelections, setPaymentSelections] = useState<Array<IPaymentSelection>>([])
  const [selectingPaymentOpt, setSelectingPaymentOpt] = useState<IPaymentSelection | null>(null)

  useEffect(() => {
    if (
      billInfo &&
      billInfo.bills.length > 0 &&
      billInfo.bills[0].installment &&
      commonUtil.isEmpty(paymentSelections)
    ) {
      const extAmount = billInfo.bills[0].installment
      let _paymentSelections: { id: number; label: string; value: number }[] = []
      let defaultSelection = null
      if (extAmount.total_debt !== undefined) {
        _paymentSelections.push({
          id: 1,
          label: 'Thanh toán hết dư nợ',
          value: extAmount.total_debt || 0,
        })
      }
      if (billInfo.bills[0].installment.default !== undefined) {
        let selection = {
          id: 2,
          label: 'Thanh toán dư nợ trong kỳ',
          value: billInfo.bills[0].installment.default || billInfo.bills[0].amount || 0,
        }
        _paymentSelections.push(selection)
        defaultSelection = selection
      }
      if (extAmount.min_pay > 0) {
        _paymentSelections.push({
          id: 3,
          label: 'Thanh toán mức tối thiểu',
          value: extAmount.min_pay || 0,
        })
      }
      if (extAmount.min_input > 0 || billInfo.paymentRule === PaymentType.PostPaid) {
        _paymentSelections.push({ id: 4, label: 'Nhập số khác', value: 0 })
      }
      setPaymentSelections(_paymentSelections)
      setSelectingPaymentOpt(defaultSelection ? defaultSelection : _paymentSelections[0])
    }
  }, [billInfo, paymentSelections])

  const onChangePaymentOpt = (paymentOpt: IPaymentSelection) => {
    setSelectingPaymentOpt(paymentOpt)
  }

  return (
    <>
      <p className="mb-3 text-xl font-bold md:mb-6 md:text-2xl">Chi tiết hóa đơn</p>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-y-4 md:p-6 md:shadow-[0_2px_12px_0] md:shadow-dark-500/5 ">
          <SupplierHeader
            supplier={supplier}
            alt="thanh-toan-dong-tien-tra-gop-truc-tuyen-an-toan"
            usingSvg={true}
          />
          <DebtInfo billInfo={modeledBillInfo} />
          {!commonUtil.isEmpty(billInfo.bills) && (
            <>
              {modeledBillInfo?.contractType !== CFContractType.Installment ? (
                <BillDescription
                  supplierID={Number(supplier.ID)}
                  paymentOptions={paymentSelections}
                  selectingPaymentOpt={selectingPaymentOpt}
                  onChangePaymentOpt={onChangePaymentOpt}
                  expiredDate={modeledBillInfo.bills[0].expired_date || ''}
                  contractType={modeledBillInfo?.contractType}
                  firstBill={modeledBillInfo.bills[0]}
                />
              ) : (
                <BillInstallment
                  contractExtInfo={modeledBillInfo.contractExtInfo}
                  expiredDate={modeledBillInfo.bills[0].expired_date || ''}
                  firstBill={modeledBillInfo.bills[0]}
                />
              )}
            </>
          )}
          <CustomerInfo
            className="pb-4 md:pb-0"
            customerCode={modeledBillInfo.customerCode}
            customerName={modeledBillInfo.customerName}
            address={modeledBillInfo.address}
            identityNumber={modeledBillInfo.identityNumber}
          />
          {!commonUtil.isEmpty(modeledBillInfo.bills) && (
            <>
              <EmailInput />

              <GotItVoucherInput productID={ProductID.CONSUMER_FINANCE} />
            </>
          )}
          <PaymentButton billInfo={modeledBillInfo} selectingPaymentOpt={selectingPaymentOpt} />
        </div>
      </FormProvider>
    </>
  )
}
