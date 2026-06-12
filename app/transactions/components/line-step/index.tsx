import classNames from 'classnames'
import style from './styles.module.scss'

export enum StepType {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  DISABLED = 'disabled',
}

export interface StepInfo {
  id?: string
  key?: string
  title: string
  stepType: StepType
  isCurrent?: boolean
}

function Step({ title, stepType, isCurrent }: StepInfo) {
  return (
    <div
      className={classNames({
        'z-10 flex w-full items-center gap-2 md:flex-col': true,
        [style.common]: true,
        [style[stepType]]: true,
      })}
    >
      <span
        className="block h-[24px] w-[24px] rounded-full bg-white bg-cover
        bg-center bg-no-repeat md:h-[36px] md:w-[36px]"
      />
      <p
        className={classNames({
          'md:text-center': true,
          'text-red-500': stepType === StepType.DANGER,
          'text-dark-300': stepType === StepType.DISABLED,
          'font-bold': !!isCurrent,
        })}
      >
        {title}
      </p>
    </div>
  )
}

export default function LineStep({ steps }: { steps: StepInfo[] }) {
  const lineEndPoint = 50 / steps.length
  return (
    <div className="relative isolate flex flex-col gap-4 md:flex-row">
      <div
        className="absolute z-0 hidden border-l border-t-0 border-dashed border-dark-100 md:block md:border-l-0 md:border-t"
        style={{ top: '18px', left: `${lineEndPoint}%`, right: `${lineEndPoint}%` }}
      />
      <div
        className="absolute z-0 block border-l border-t-0 border-dashed border-dark-100 md:hidden md:border-l-0 md:border-t"
        style={{ left: '11px', top: '12px', bottom: '12px' }}
      />
      {steps.map((step: StepInfo, index) => (
        <Step
          key={`step-${index + 1}`}
          title={step.title}
          stepType={step.stepType}
          isCurrent={step.isCurrent}
        />
      ))}
    </div>
  )
}
