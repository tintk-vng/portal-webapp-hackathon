import BottomSheet from '@/components/common/bottom-sheet'
import Image from '@/components/common/image'
import useToggle from '@/hooks/use-toggle'
import commonUtil from '@/utils/common'
import CheckBoxIcon from '../check-box'
import { cpsImageUrlWithPath, imageLoader } from '@/utils/bill'
import { useFormContext } from 'react-hook-form'

const ArrowUp = '/images/icons/primary_arrow_up_ic16.svg'

export interface OptionData {
  supplier_id: number
  name: string
  icon?: string
  passData?: string // JSON stringify
}
interface SeletBottomSheetProps {
  title: string
  optionDatas: OptionData[]
  onOptionClick: (option: OptionData) => void
  selectedOptionID?: number
}
const FIELD_NAME = 'supplier'
export default function SeletBottomSheet({
  title,
  optionDatas,
  onOptionClick,
  selectedOptionID = 0,
}: SeletBottomSheetProps) {
  const {

    formState: { errors },
  } = useFormContext()
  const errorMessage = errors[FIELD_NAME]?.message as string
  const [visible, toggle] = useToggle()
  const selectedOption: OptionData = optionDatas.find(
    (option) => option.supplier_id === selectedOptionID
  ) ?? {
    supplier_id: -1,
    name: '',
  }
  
  function handleClickChild(optionData: OptionData) {
    onOptionClick(optionData)
    toggle()
  }

  return (
    <>
      <div
        className={`flex items-center rounded-lg border bg-white-500 p-4 ${errorMessage ? 'border-rose-600' : 'border-dark-100 '}`}
        onClick={toggle}
      >
        {selectedOption.supplier_id > 0 ? (
          <>
            <Image
              src={cpsImageUrlWithPath(`logo/${selectedOption?.icon}.png`)}
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
            className="bg-conver pointer-events-none h-[16px] w-[16px] rotate-90 bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${ArrowUp}')` }}
          />
        </div>
      </div>
      {visible && (
        <BottomSheet visible={visible} onClose={toggle} title={title}>
          <div className="no-scrollbar -mx-4 max-h-[22.75rem] overflow-y-scroll">
            {optionDatas.map((optionData, index) => {
              const isSelected = optionData.supplier_id === selectedOptionID
              const hasIcon = !commonUtil.isEmpty(optionData.icon)
              let iconsWidth = 36
              if (hasIcon) {
                iconsWidth += 48
              }
              return (
                <div key={optionData.supplier_id}>
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
                        src={cpsImageUrlWithPath(`logo/${optionData.icon}.png`)}
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
