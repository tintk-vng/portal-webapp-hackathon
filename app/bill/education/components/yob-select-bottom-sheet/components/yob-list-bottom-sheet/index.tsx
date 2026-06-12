import BottomSheet from '@/components/common/bottom-sheet'
import YearPicker from '../../../year-picker'
interface ISchoolListBottomSheet {
  visible: boolean
  title: string
  onClose: Function
  years: Array<number>
  selectingYOB: number | null
  onSelectYOB: (year: number) => void
}
const YOBListBottomSheet = ({
  visible = false,
  title = 'Chọn năm sinh',
  onClose = () => {},
  years = [],
  onSelectYOB = () => {},
  selectingYOB = null,
}: Partial<ISchoolListBottomSheet>) => {
  return (
    <>
      <BottomSheet
        title={title}
        visible={visible}
        onClose={() => {
          onClose()
        }}
      >
        <YearPicker
          options={years}
          selectedOption={years.findIndex((year) => year === selectingYOB)}
          onOptionSelect={(year) => {
            onSelectYOB(year)
          }}
        />
      </BottomSheet>
    </>
  )
}
export default YOBListBottomSheet
