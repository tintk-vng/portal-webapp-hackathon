import classNames from 'classnames'
import { ReactElement } from 'react'

export enum InformType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

interface InformProps {
  children: ReactElement | string
  type: InformType
}

export default function Inform({ children, type = InformType.INFO }: InformProps) {
  return (
    <div
      className={classNames({
        'rounded-lg px-4 py-2.5': true,
        'bg-blue-50': type === InformType.INFO,
        'bg-green-50': type === InformType.INFO,
        'bg-orange-25': type === InformType.WARNING,
        'bg-red-50': type === InformType.ERROR,
      })}
    >
      {children}
    </div>
  )
}
