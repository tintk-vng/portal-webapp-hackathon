'use client'

import commonUtil from '@/utils/common'
import classNames from 'classnames'
import { useContext } from 'react'
import { GooglePlayContext } from '../main'

export default function TotalAmount() {
  const { amount } = useContext(GooglePlayContext)

  return (
    <div
      className={classNames({
        'mb-4 flex items-center justify-between md:mb-6 md:flex md:h-8': true,
        hidden: amount === 0,
      })}
    >
      <label className="text-label-lg">Tổng tiền</label>

      <p className="text-xl font-bold md:text-2xl">{commonUtil.formatCurrency(amount)}</p>
    </div>
  )
}
