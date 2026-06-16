import Button, { ButtonSize, ButtonType } from '@/components/common/button'
import React, { useEffect, useRef, useState } from 'react'
import './styles.scss'

const ITEM_HEIGHT = 33

let scrollTimer: ReturnType<typeof setTimeout>

export interface YearPickerProps {
  options: number[]
  selectedOption: number
  onOptionSelect: (option: number) => void
}

export default function YearPicker({ options, selectedOption, onOptionSelect }: YearPickerProps) {
  const [activeValue, setActiveValue] = useState(selectedOption)
  const fixedDayListRef = useRef<HTMLUListElement>(null)

  const handleScroll = (e: any) => {
    const scroll = e.srcElement.scrollTop
    const currentValue = Math.round((scroll + ITEM_HEIGHT / 2) / ITEM_HEIGHT)
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
    scrollTimer = setTimeout(() => {
      currentValue !== activeValue && setActiveValue(currentValue)
    }, 150)
  }

  const setPickerWindowPosition = () => {
    if (activeValue) {
      if (fixedDayListRef?.current) {
        fixedDayListRef.current.scrollTop = (activeValue + 1) * ITEM_HEIGHT - ITEM_HEIGHT / 2

        fixedDayListRef.current.addEventListener('scroll', handleScroll)
      }
      return () => {
        fixedDayListRef?.current?.removeEventListener('scroll', handleScroll)
      }
    }
  }

  useEffect(() => {
    setPickerWindowPosition()
  }, [setPickerWindowPosition])

  const handleConfirm = () => {
    if (!fixedDayListRef.current) {
      return
    }

    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }

    const scroll = fixedDayListRef.current.scrollTop
    const currentValue = Math.round((scroll + ITEM_HEIGHT / 2) / ITEM_HEIGHT)

    onOptionSelect(options[currentValue - 1])
  }

  return (
    <div className="fixed-day-section">
      <div className="picker">
        <div className="picker__window"></div>
        <ul ref={fixedDayListRef}>
          {options.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </div>
      <Button
        width="w-full"
        size={ButtonSize.LARGE}
        type={ButtonType.SECONDARY}
        onClick={() => {
          handleConfirm()
        }}
      >
        Xong
      </Button>
    </div>
  )
}
