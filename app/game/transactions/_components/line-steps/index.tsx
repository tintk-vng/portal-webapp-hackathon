'use client'

import { TransactionStatus } from '@/constants/common'
import classNames from 'classnames'

export enum StepType {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  DISABLED = 'disabled',
}

export interface Step {
  ID: string
  title: string
  type: StepType
  isCurrent?: boolean
}

interface LineStepProps {
  step: Step
}

function LineStep({ step }: LineStepProps) {
  const { title, type, isCurrent } = step
  const stepIconStyles: Record<StepType, string> = {
    [StepType.SUCCESS]:
      'bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/success.svg")]',
    [StepType.WARNING]:
      'bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/pending.svg")]',
    [StepType.DANGER]:
      'bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/failure.svg")]',
    [StepType.DISABLED]:
      'bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons_v2/web_payment/disabled.svg")]',
  }

  return (
    <div className="z-10 flex w-full items-center gap-2 md:flex-col">
      <span
        className={classNames(
          'block h-[24px] w-[24px] rounded-full bg-white bg-cover bg-center bg-no-repeat md:h-[36px] md:w-[36px]',
          stepIconStyles[type]
        )}
      />
      <p
        className={classNames('md:text-center', {
          'text-red-500': type === StepType.DANGER,
          'text-dark-300': type === StepType.DISABLED,
          'font-bold': !!isCurrent,
        })}
      >
        {title}
      </p>
    </div>
  )
}

const generateSteps = (
  paymentStatus = TransactionStatus.PROCESSING,
  providerStatus = TransactionStatus.PROCESSING
): Step[] => {
  const zlpStep: Step = {
    ID: 'zalopay',
    title: 'Zalopay trừ tiền thành công',
    type: StepType.SUCCESS,
  }
  const providerStep: Step = {
    ID: 'provider',
    title: 'Nhà cung cấp xử lý',
    type: StepType.DISABLED,
  }
  const summaryStep: Step = {
    ID: 'summary',
    title: 'Giao dịch thành công',
    type: StepType.DISABLED,
  }
  if (providerStatus === TransactionStatus.FAIL) {
    providerStep.title = 'Nhà cung cấp xử lý thất bại'
    providerStep.type = StepType.DANGER
    summaryStep.title = 'Đã hoàn tiền'
    summaryStep.type = StepType.SUCCESS
    summaryStep.isCurrent = true
  } else if (providerStatus === TransactionStatus.SUCCESS) {
    providerStep.title = 'Nhà cung cấp xử lý thành công'
    providerStep.type = StepType.SUCCESS
    summaryStep.type = StepType.SUCCESS
    summaryStep.isCurrent = true
  } else if (paymentStatus === TransactionStatus.FAIL) {
    zlpStep.title = 'Zalopay trừ tiền thất bại'
    zlpStep.type = StepType.DANGER
    zlpStep.isCurrent = true
  } else if (paymentStatus === TransactionStatus.SUCCESS) {
    providerStep.type = StepType.WARNING
    providerStep.isCurrent = true
    summaryStep.title = 'Giao dịch đang xử lý'
    summaryStep.type = StepType.WARNING
  } else {
    zlpStep.title = 'Zalopay đang trừ tiền'
    zlpStep.type = StepType.WARNING
    zlpStep.isCurrent = true
  }
  return [zlpStep, providerStep, summaryStep]
}

interface LineStepsProps {
  paymentStatus: TransactionStatus
  transactionStatus: TransactionStatus
}

export default function LineSteps({ paymentStatus, transactionStatus }: LineStepsProps) {
  const steps = generateSteps(paymentStatus, transactionStatus)
  const lineEndPoint = 50 / steps.length

  return (
    <div className="relative isolate flex flex-col gap-4 md:mt-10 md:flex-row">
      <div
        className="absolute top-[18px] z-0 hidden border-l border-t-0 border-dashed border-dark-100 md:block md:border-l-0 md:border-t"
        style={{ left: `${lineEndPoint}%`, right: `${lineEndPoint}%` }}
      />

      <div className="absolute bottom-[12px] left-[11px] top-[12px] z-0 block border-l border-t-0 border-dashed border-dark-100 md:hidden md:border-l-0 md:border-t" />

      {steps.map((step) => (
        <LineStep key={step.ID} step={step} />
      ))}
    </div>
  )
}
