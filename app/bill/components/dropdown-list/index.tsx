import useOutsideClick from '@/hooks/use-outside-click'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import CheckBoxIcon from '../check-box'
import { OptionData } from '../select-bottom-sheet'
import style from '../select-bottom-sheet/style.module.scss'

interface DropdownListProps {
  title: string
  optionDatas: OptionData[]
  onOptionClick: (option: OptionData) => void
  selectedOptionID?: string
}
export default function DropdownList({
  title,
  optionDatas,
  onOptionClick,
  selectedOptionID = '',
}: DropdownListProps) {
  const [visible, setVisible] = useState(false)
  const selectedOption: OptionData = optionDatas.find(
    (option) => option.ID === selectedOptionID
  ) ?? {
    ID: '',
    title,
  }
  let selectedIconWidth = 36
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  function handleClickOption(optionData: OptionData) {
    onOptionClick(optionData)
    setVisible(false)
  }

  function handleClose() {
    if (visible) {
      setVisible(false)
    }
  }

  useOutsideClick(dropdownRef, handleClose)

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex min-h-[52px] w-full items-center gap-x-3 rounded-lg border border-dark-100 bg-white-500 px-4 [&>*]:pointer-events-none"
          onClick={() => setVisible(!visible)}
        >
          <p
            className="py-2 text-left text-label-lg"
            style={{ width: `calc(100% - ${selectedIconWidth}px)` }}
          >
            {selectedOption.title}
          </p>
          <div className="flex h-[24px] w-[24px] items-center justify-center">
            <span
              className={classNames({
                [`${style.arrowUpIcon}`]: true,
                'h-[16px] w-[16px] bg-cover bg-center bg-no-repeat transition-transform': true,
                'rotate-180': !visible,
              })}
            />
          </div>
        </button>
        {visible && (
          <div className="absolute inset-x-0 top-full z-10 pt-1">
            <div className="no-scrollbar max-h-[23rem] overflow-y-scroll bg-white-500 shadow-[0_2px_12px_0] shadow-dark-500/5 ">
              {optionDatas.map((optionData, index) => {
                const isSelected = optionData.ID === selectedOptionID
                let iconsWidth = 36
                return (
                  <div key={optionData.ID}>
                    {index > 0 && (
                      <div className="divider px-4">
                        <div className="h-px w-full bg-dark-50" />
                      </div>
                    )}
                    <div
                      className="flex cursor-pointer items-center gap-x-3 px-4 py-3"
                      onClick={() => handleClickOption(optionData)}
                    >
                      <p
                        className="pointer-events-none"
                        style={{ width: `calc(100% - ${iconsWidth}px)` }}
                      >
                        {optionData.title}
                      </p>
                      <CheckBoxIcon isSelected={isSelected} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
