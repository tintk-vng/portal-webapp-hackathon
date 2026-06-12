'use client'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

interface QuantitySpinnerProps {
  initialValue: number
  min: number
  max: number
  onChange: (newValue: number) => void
}

export default function QuantitySpinner({
  initialValue,
  min,
  max,
  onChange,
}: QuantitySpinnerProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    onChange(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="flex items-center space-x-2">
      <span
        className={classNames({
          'w-[32]px	h-[32px] min-w-[32px] cursor-pointer bg-contain bg-center bg-no-repeat': true,
          "bg-[url('/images/icons/primary_minus.svg')]": value > min,
          "bg-[url('/images/icons/minus.svg')]": value <= min,
        })}
        onClick={() => {
          setValue((value) => (value <= min ? min : value - 1))
        }}
      />

      <span className="flex w-6 items-center justify-center text-lg font-bold">{value}</span>
      <span
        className={classNames({
          'w-[32]px	h-[32px] min-w-[32px] cursor-pointer bg-contain bg-center bg-no-repeat': true,
          "bg-[url('/images/icons/primary_plus.svg')]": value < max,
          "bg-[url('/images/icons/plus.svg')]": value >= max,
        })}
        onClick={() => setValue((value) => (value >= max ? max : value + 1))}
      />
    </div>
  )
}
