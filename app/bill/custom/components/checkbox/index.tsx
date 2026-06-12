import classNames from 'classnames'
import React, { ReactNode, SyntheticEvent } from 'react'

interface CheckboxProps {
  label: ReactNode
  value: any
  isChecked: boolean
  themeColor?: string
  onChange: (value: any) => void
}

export default function Checkbox({
  label,
  value,
  isChecked,
  onChange,
  themeColor = '#ff8302',
}: CheckboxProps) {
  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement
    onChange(target.value)
  }

  return (
    <label className="relative my-[24px] flex items-center">
      <input
        className="absolute hidden h-0 w-0 opacity-0"
        type="checkbox"
        value={value}
        checked={isChecked}
        onChange={handleChange}
      />
      <div className="jutify-center flex">
        <span
          style={isChecked ? { backgroundColor: themeColor } : {}}
          className={classNames({
            'relative inline-block h-5 w-5 cursor-pointer rounded': true,
            'border-2 border-dark-200 bg-white-500': !isChecked,
            // [`bg-[#${themeColor}]`]: isChecked,
            "border-0 after:absolute after:left-2 after:top-1 after:h-2.5 after:w-[5px] after:rotate-45 after:border-b-2 after:border-r-2 after:border-white-500 after:content-['']":
              isChecked,
          })}
        />
      </div>
      <span className="ml-3 cursor-pointer text-sm">{label}</span>
    </label>
  )
}
//
