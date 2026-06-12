import CheckBoxIcon from '@/app/bill/components/check-box'
import BottomSheet from '@/components/common/bottom-sheet'
import Image from '@/components/common/image'
import useToggle from '@/hooks/use-toggle'
import { imageLoader } from '@/utils/bill'
import commonUtil from '@/utils/common'
import style from './style.module.scss'

export interface OptionData {
  ID: string
  title: string
  icon?: string
  passData?: string // JSON stringify
}
interface SeletBottomSheetProps {
  title: string
  optionDatas: OptionData[]
  onOptionClick: (option: OptionData) => void
  selectedOptionID?: string
}
export default function SeletBottomSheet({
  title,
  optionDatas,
  onOptionClick,
  selectedOptionID = '',
}: SeletBottomSheetProps) {
  const [visible, toggle] = useToggle()
  const selectedOption: OptionData = optionDatas.find(
    (option) => option.ID === selectedOptionID
  ) ?? {
    ID: '',
    title,
  }
  let selectedIconWidth = 36
  if (selectedOption.icon) {
    selectedIconWidth += 48
  }

  function handleClickOption(optionData: OptionData) {
    onOptionClick(optionData)
    toggle()
  }

  return (
    <>
      <div
        className="flex min-h-[57px] items-center gap-x-3 rounded-lg border border-dark-100 bg-white-500 px-4 [&>*]:pointer-events-none"
        onClick={toggle}
      >
        {selectedOption.icon && (
          <Image
            src={selectedOption.icon}
            alt="option-icon"
            width={36}
            height={36}
            loader={({ src }) => src}
          />
        )}
        <p className="py-2 text-label-lg" style={{ width: `calc(100% - ${selectedIconWidth}px)` }}>
          {selectedOption.title}
        </p>
        <div className="flex h-[24px] w-[24px] items-center justify-center">
          <span
            className={`${style.arrowUpIcon} pointer-events-none h-[16px] w-[16px] rotate-90 bg-cover bg-center bg-no-repeat`}
          />
        </div>
      </div>
      {visible && (
        <BottomSheet visible={visible} onClose={toggle} title={title}>
          <div className="no-scrollbar -mx-4 max-h-[22.75rem] overflow-y-scroll">
            {optionDatas.map((optionData, index) => {
              const isSelected = optionData.ID === selectedOptionID
              const hasIcon = !commonUtil.isEmpty(optionData.icon)
              let iconsWidth = 36
              if (hasIcon) {
                iconsWidth += 48
              }
              return (
                <div key={optionData.ID}>
                  {index > 0 && (
                    <div className="divider px-4">
                      <div className="h-px w-full bg-dark-50" />
                    </div>
                  )}
                  <div
                    className="flex cursor-pointer items-center gap-x-3 p-4 [&>*]:pointer-events-none"
                    onClick={() => handleClickOption(optionData)}
                  >
                    {optionData.icon && (
                      <Image
                        src={optionData.icon}
                        alt="option-icon"
                        width={36}
                        height={36}
                        loader={imageLoader}
                      />
                    )}
                    <p style={{ width: `calc(100% - ${iconsWidth}px)` }}>{optionData.title}</p>
                    <CheckBoxIcon isSelected={isSelected} />
                  </div>
                </div>
              )
            })}
          </div>
        </BottomSheet>
      )}
    </>
  )
}
