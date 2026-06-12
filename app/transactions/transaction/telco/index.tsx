import Button, { ButtonSize, ButtonType } from '@/components/common/button'
import { Domain, EVENT, MAPPED_PATH, TransactionStatus } from '@/constants/common'
import { ProductID as TelcoProductID } from '@/constants/telco'
import { Transaction } from '@/types/common'
import commonUtil from '@/utils/common'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CallToAction, { CallToActionProps } from '../../components/call-to-action'
import LineStep, { StepInfo, StepType } from '../../components/line-step'
import RowInfo from '../../components/row-info'
import StateView from '../../components/state-view'
import {
  TransactionDescriptionFormat,
  generateInitialCTA,
  generateSupportCTA,
  generateTransactionStateViewData,
} from '../../shared'
import CardTransaction from './card-transaction'

const CTA_TITLE: { [key: number]: string } = {
  [TelcoProductID.TOPUP]: 'Nạp tiếp',
  [TelcoProductID.PHONE_CARD]: 'Mua tiếp',
  [TelcoProductID.DATA_TOPUP]: 'Nạp tiếp',
  [TelcoProductID.DATA_CODE]: 'Mua tiếp',
  [TelcoProductID.COMBO]: 'Nạp tiếp',
  [TelcoProductID.GOOGLEPLAY]: 'Mua tiếp',
  [TelcoProductID.GAME]: 'Mua tiếp',
}

export function generateSteps(
  paymentStatus = TransactionStatus.PROCESSING,
  providerStatus = TransactionStatus.PROCESSING
) {
  const zlpStep: StepInfo = {
    id: 'zalopay',
    title: 'Zalopay trừ tiền thành công',
    stepType: StepType.SUCCESS,
  }
  const providerStep: StepInfo = {
    id: 'provider',
    title: 'Nhà cung cấp xử lý',
    stepType: StepType.DISABLED,
  }
  const summaryStep: StepInfo = {
    id: 'summary',
    title: 'Giao dịch thành công',
    stepType: StepType.DISABLED,
  }

  if (providerStatus === TransactionStatus.FAIL) {
    providerStep.title = 'Nhà cung cấp xử lý thất bại'
    providerStep.stepType = StepType.DANGER
    summaryStep.title = 'Đã hoàn tiền'
    summaryStep.stepType = StepType.SUCCESS
    summaryStep.isCurrent = true
  } else if (providerStatus === TransactionStatus.SUCCESS) {
    providerStep.title = 'Nhà cung cấp xử lý thành công'
    providerStep.stepType = StepType.SUCCESS
    summaryStep.stepType = StepType.SUCCESS
    summaryStep.isCurrent = true
  } else if (paymentStatus === TransactionStatus.FAIL) {
    zlpStep.title = 'Zalopay trừ tiền thất bại'
    zlpStep.stepType = StepType.DANGER
    zlpStep.isCurrent = true
  } else if (paymentStatus === TransactionStatus.SUCCESS) {
    providerStep.stepType = StepType.WARNING
    providerStep.isCurrent = true
    summaryStep.title = 'Giao dịch đang xử lý'
    summaryStep.stepType = StepType.WARNING
  } else {
    zlpStep.title = 'Zalopay đang trừ tiền'
    zlpStep.stepType = StepType.WARNING
    zlpStep.isCurrent = true
  }
  return [zlpStep, providerStep, summaryStep]
}

function renderEmailRowInfo(email = '', title = 'Email nhận thẻ') {
  return (
    <RowInfo>
      <label className="w-1/3 text-dark-300">{title}</label>

      <label className="w-2/3 text-right">{email}</label>
    </RowInfo>
  )
}

function renderCustomArea(productID: TelcoProductID, transaction: Transaction) {
  const { customData = {} } = transaction
  switch (productID) {
    case TelcoProductID.TOPUP:
      return (
        <div className="mt-4 px-4 md:mt-10 md:px-0">
          <div className="md:rounded-lg md:border md:border-dark-50 md:px-6 md:pb-3 md:pt-6">
            <p className="mb-1 text-base font-bold md:mb-2">Thông tin giao dịch</p>
            <div className="divide-y divide-dark-50 text-label-md md:text-label-lg">
              <RowInfo title="Nhà mạng" value={customData.supplier_name} />
              <RowInfo title="Số điện thoại" value={customData.phone_number} />
              <RowInfo title="Mệnh giá" value={commonUtil.formatCurrency(transaction.amount)} />
              {renderEmailRowInfo(transaction.email, 'Email')}
            </div>
          </div>
        </div>
      )
    case TelcoProductID.DATA_TOPUP:
      return (
        <div className="mt-4 px-4 md:mt-10 md:px-0">
          <div className="md:rounded-lg md:border md:border-dark-50 md:px-6 md:pb-3 md:pt-6">
            <p className="mb-1 text-base font-bold md:mb-2">Thông tin giao dịch</p>
            <div className="divide-y divide-dark-50 text-label-md md:text-label-lg">
              <RowInfo title="Nhà mạng" value={customData.supplier_name} />
              <RowInfo title="Số điện thoại" value={customData.phone_number} />
              <RowInfo title="Gói data" value={customData.package_name} />
              <RowInfo title="Mệnh giá" value={commonUtil.formatCurrency(transaction.amount)} />
              {renderEmailRowInfo(transaction.email, 'Email')}
            </div>
          </div>
        </div>
      )
    case TelcoProductID.DATA_CODE:
      return (
        <div className="mt-4 px-4 md:mt-10 md:px-0">
          <div className="md:rounded-lg md:border md:border-dark-50 md:px-6 md:pb-3 md:pt-6">
            <p className="mb-1 text-base font-bold md:mb-2">Thông tin giao dịch</p>
            <div className="divide-y divide-dark-50 text-label-md md:text-label-lg">
              <RowInfo title="Nhà mạng" value={customData.supplier_name} />
              <RowInfo title="Gói data" value={customData.package_name} />
              <RowInfo
                title="Mệnh giá thẻ"
                value={commonUtil.formatCurrency(customData.unit_price)}
              />
              <RowInfo title="Số lượng" value={customData.quantity} />
              {renderEmailRowInfo(transaction.email)}
              <RowInfo>
                <label className="w-full text-dark-300">Tổng tiền đơn hàng</label>
                <label className="w-full text-right font-bold">
                  {commonUtil.formatCurrency(transaction.amount)}
                </label>
              </RowInfo>
            </div>
          </div>
        </div>
      )
    case TelcoProductID.COMBO:
      return (
        <div className="mt-4 px-4 md:mt-10 md:px-0">
          <div className="md:rounded-lg md:border md:border-dark-50 md:px-6 md:pb-3 md:pt-6">
            <p className="mb-1 text-base font-bold md:mb-2">Thông tin giao dịch</p>
            <div className="divide-y divide-dark-50 text-label-md md:text-label-lg">
              <RowInfo title="Nhà mạng" value={customData.supplier_name} />
              <RowInfo title="Số điện thoại" value={customData.phone_number} />
              <RowInfo title="Gói combo" value={customData.package_name} />
              <RowInfo title="Mệnh giá" value={commonUtil.formatCurrency(transaction.amount)} />
              {renderEmailRowInfo(transaction.email, 'Email')}
            </div>
          </div>
        </div>
      )
    case TelcoProductID.PHONE_CARD:
    case TelcoProductID.GOOGLEPLAY:
    case TelcoProductID.GAME:
      return <CardTransaction transaction={transaction} />
    default:
      return null
  }
}

function generateHomeURL(productID: TelcoProductID) {
  const url =
    MAPPED_PATH[Domain.TELCO][
      productID === TelcoProductID.POST_PAID_VNPT ? TelcoProductID.POST_PAID : productID
    ]?.source ?? ''
  return url
}

export default function TelcoTransaction({
  productID,
  paymentStatus,
  transaction,
}: {
  productID: TelcoProductID
  paymentStatus: TransactionStatus
  transaction: Transaction
}) {
  const router = useRouter()
  const CTAs = generateCTAs()
  const steps = generateSteps(paymentStatus, transaction.status)
  const isTransactionEmpty = commonUtil.isEmpty(transaction)

  const messageFormat: TransactionDescriptionFormat = {}
  switch (productID) {
    case TelcoProductID.PHONE_CARD:
    case TelcoProductID.DATA_CODE:
      messageFormat.success = 'Kết quả thanh toán và mã thẻ đã được Zalopay gửi đến email'
      messageFormat.processing = 'Kết quả thanh toán và mã thẻ đã được Zalopay gửi đến email'
      break
  }
  const { image, title, description } = generateTransactionStateViewData(
    paymentStatus,
    transaction,
    messageFormat
  )

  useEffect(() => {
    setTimeout(() => {
      commonUtil.trackEvent({
        ID: EVENT.RESULT_PAGE.LOAD_PAGE,
        metaData: { transaction_status: title },
      })
    }, 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function generateCTAs() {
    const supportCTA = generateSupportCTA(transaction)
    const newCTAs: CallToActionProps[] = [supportCTA]
    const initialCTA = generateInitialCTA()
    const homeURL = generateHomeURL(productID)
    const homeTitle = CTA_TITLE[productID] ?? 'Thanh toán tiếp'
    newCTAs.push({
      ...initialCTA,
      title: homeTitle,
      onCTAClick: () => {
        router.push(homeURL)
      },
      event: {
        ID: EVENT.RESULT_PAGE.CLICK_CUSTOM_BUTTON,
        metaData: {
          cta_name: homeTitle,
        },
      },
    })
    return newCTAs
  }

  return (
    <>
      <StateView image={image} title={title} description={description} />

      <div className="p-4 md:mt-10 md:p-0">
        <LineStep steps={steps} />
      </div>

      {!isTransactionEmpty && renderCustomArea(productID, transaction)}

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
