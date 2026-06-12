import useScreen, { ScreenSize } from '@/hooks/use-screen'
import GeneralCalendar from '@/public/images/icons/general_calendar.svg'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import SelectComponent from '../select-component'
import YOBListBottomSheet from './components/yob-list-bottom-sheet'
import YOBListDropdown from './components/yob-list-drop-down'

const FIELD_NAME = 'yob'
const initYear = 1992
const YOBSelectBottomSheet = () => {
  const [showProviders, setShowProviders] = useState(false)
  const [years, setYears] = useState<Array<number>>([])
  const [selectingYOB, setSelectingYOB] = useState<number | null>(null)
  const { size } = useScreen()
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors[FIELD_NAME]?.message as string
  useEffect(() => {
    const years = []
    const currentYear = new Date().getFullYear()
    for (let index = initYear; index < currentYear; index++) {
      years.push(index)
    }
    setYears(years)
  }, [])

  const isMobile = size === ScreenSize.SMALL
  const onClick = () => {
    setShowProviders(!showProviders)
  }
  const onClose = () => {
    setShowProviders(false)
  }

  const onSelectYOB = (yob: number) => {
    setSelectingYOB(yob)
    setValue(FIELD_NAME, yob)
    onClose()
    if (errorMessage) {
      clearErrors(FIELD_NAME)
    }
  }

  return (
    <div className="relative w-full">
      <input
        {...register(FIELD_NAME, {
          required: `Bạn chưa chọn năm sinh`,
        })}
        style={{ display: 'none' }}
      />

      <SelectComponent
        value={selectingYOB ? selectingYOB.toString() : ''}
        placeholder="Chọn năm sinh"
        icon={GeneralCalendar}
        errMsg={errorMessage}
        onClick={() => {
          if (!showProviders) {
            onClick()
          }
        }}
      />
      {isMobile ? (
        <YOBListBottomSheet
          visible={showProviders}
          onClose={onClose}
          years={years}
          onSelectYOB={onSelectYOB}
          selectingYOB={selectingYOB}
        />
      ) : (
        <YOBListDropdown
          visible={showProviders}
          onClose={onClose}
          years={years}
          onSelectYOB={onSelectYOB}
          selectingYOB={selectingYOB}
        />
      )}
    </div>
  )
}
export default YOBSelectBottomSheet
