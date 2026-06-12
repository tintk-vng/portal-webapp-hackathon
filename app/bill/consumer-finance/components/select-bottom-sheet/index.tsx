import BottomSheet from '@/components/common/bottom-sheet'
import Image from '@/components/common/image'
import useToggle from '@/hooks/use-toggle'
import commonUtil from '@/utils/common'
import { cpsImageUrlWithPath, imageLoader } from '@/utils/bill'
import { useFormContext } from 'react-hook-form'
import CheckBoxIcon from '@/app/bill/components/check-box'

const ArrowUp = '/images/icons/primary_arrow_up_ic16.svg'

export interface OptionData {
  ID: string
  name: string
  icon?: string
  passData?: string // JSON stringify
}
interface SelectBottomSheet {
  title: string
  optionDatas: OptionData[]
  onOptionClick: (option: OptionData) => void
  selectedOptionID?: string
}
const FIELD_NAME = 'supplier'
export default function SelectBottomSheet({
  title,
  optionDatas,
  onOptionClick,
  selectedOptionID = '',
}: SelectBottomSheet) {
  const {
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors[FIELD_NAME]?.message as string
  const [visible, toggle] = useToggle()
  const selectedOption: OptionData = optionDatas.find(
    (option) => option.ID === selectedOptionID
  ) ?? {
    ID: '',
    name: '',
  }

  function handleClickChild(optionData: OptionData) {
    onOptionClick(optionData)
    toggle()
  }

  return (
    <>
      <div
        className={`flex items-center rounded-lg border bg-white-500 p-4 ${
          errorMessage ? 'border-rose-600' : 'border-dark-100 '
        }`}
        onClick={toggle}
      >
        {selectedOption.ID ? (
          <>
            <Image
              src={cpsImageUrlWithPath(`logo/${selectedOption?.icon}_v2.svg`)}
              alt="supplier-logo"
              width={36}
              height={36}
              loader={imageLoader}
            />
            <p className="ml-3 text-label-lg" style={{ width: 'calc(100% - 36px)' }}>
              {selectedOption.name}
            </p>
          </>
        ) : (
          <p className="text-label-lg text-dark-200" style={{ width: 'calc(100% - 36px)' }}>
            Chọn nhà cung cấp
          </p>
        )}

        <div className="ml-3 flex h-[24px] w-[24px] items-center justify-center">
          <span
            className="pointer-events-none h-[16px] w-[16px] rotate-90 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${ArrowUp}')` }}
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
                    className="flex cursor-pointer items-center gap-x-3 p-4"
                    onClick={() => handleClickChild(optionData)}
                  >
                    {optionData.icon && (
                      <Image
                        src={cpsImageUrlWithPath(`logo/${optionData.icon}_v2.svg`)}
                        alt="option-icon"
                        width={36}
                        height={36}
                        className="pointer-events-none"
                        loader={imageLoader}
                      />
                    )}
                    <p
                      className="pointer-events-none"
                      style={{ width: `calc(100% - ${iconsWidth}px)` }}
                    >
                      {optionData.name}
                    </p>
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
