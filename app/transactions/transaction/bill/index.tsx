import { ProductID as BillProductID } from '@/constants/bill'
import { Domain, EVENT, MAPPED_PATH, TransactionStatus } from '@/constants/common'
import { Transaction } from '@/types/common'
import commonUtil from '@/utils/common'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CallToAction, { CallToActionProps } from '../../components/call-to-action'
import RowInfo from '../../components/row-info'
import StateView from '../../components/state-view'
import {
  generateInitialCTA,
  generateSupportCTA,
  generateTransactionStateViewData,
} from '../../shared'

function generateHomeURL(productID: BillProductID): string {
  const url = MAPPED_PATH[Domain.BILL][productID]?.source ?? ''
  return url
}

export default function BillTransaction({
  productID,
  paymentStatus,
  transaction,
}: {
  productID: BillProductID
  paymentStatus: TransactionStatus
  transaction: Transaction
}) {
  const router = useRouter()
  const CTAs = generateCTAs()
  const { image, title, description } = generateTransactionStateViewData(paymentStatus, transaction)
  const isTransactionEmpty = commonUtil.isEmpty(transaction)
  const { appTransID, amount, customData = {} } = transaction

  useEffect(() => {
    setTimeout(() => {
      commonUtil.trackEvent({
        ID: EVENT.RESULT_PAGE.LOAD_PAGE,
        metaData: { transaction_status: title },
      })
    }, 200)
  }, [])

  function generateCTAs() {
    const supportCTA = generateSupportCTA(transaction)
    const newCTAs: CallToActionProps[] = [supportCTA]

    const homeURL = generateHomeURL(productID)
    const initialCTA = generateInitialCTA()
    newCTAs.push({
      ...initialCTA,
      title: 'Về trang chủ',
      onCTAClick: () => {
        router.push(homeURL)
      },
      event: {
        ID: EVENT.RESULT_PAGE.CLICK_CUSTOM_BUTTON,
        metaData: {
          cta_name: 'Về trang chủ',
        },
      },
    })
    return newCTAs
  }

  return (
    <>
      <StateView image={image} title={title} description={description} />
      {!isTransactionEmpty && (
        <div className="mt-4 px-4 md:mt-10 md:px-0">
          <div className="md:rounded-lg md:border md:border-dark-50 md:px-6 md:pb-3 md:pt-6">
            <p className="mb-1 text-base font-bold md:mb-2">Thông tin khách hàng</p>
            <div className="divide-y divide-dark-50 text-label-md md:text-label-lg">
              <RowInfo title="Mã đơn hàng" value={appTransID} />
              <RowInfo>
                <label className="w-full text-dark-300">Số tiền</label>
                <label className="w-full text-right font-bold">
                  {commonUtil.formatCurrency(amount)}
                </label>
              </RowInfo>
              <RowInfo title="Mã khách hàng" value={customData.customer_code} />
              <RowInfo title="Tên khách hàng" value={customData.customer_name} />
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-col gap-2 px-4 md:mt-10 md:flex-row md:gap-6 md:px-0">
        {CTAs.map((CTA, index) => (
          <CallToAction
            key={`call-to-action.${index}`}
            title={CTA.title}
            onCTAClick={CTA.onCTAClick}
            preIconLink={CTA.preIconLink}
            postIconLink={CTA.postIconLink}
            event={CTA.event}
          />
        ))}
      </div>
    </>
  )
}
