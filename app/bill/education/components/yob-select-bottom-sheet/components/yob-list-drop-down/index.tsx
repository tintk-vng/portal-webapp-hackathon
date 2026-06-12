import useOutsideClick from '@/hooks/use-outside-click'
import classNames from 'classnames'
import { useRef } from 'react'
interface ISchoolListDropdown {
  visible: boolean
  onClose: Function
  years: Array<number>
  onSelectYOB: (yob: number) => void
  selectingYOB: number | null
}
const YOBListDropdown = ({
  visible = false,
  onClose = () => {},
  years = [],
  onSelectYOB = () => {},
  selectingYOB = null,
}: Partial<ISchoolListDropdown>) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleClose = () => {
    onClose()
  }
  useOutsideClick(dropdownRef, handleClose)

  if (!visible) {
    return null
  }
  return (
    <div
      ref={dropdownRef}
      className="absolute z-[100] mt-2 w-full bg-white py-4 md:rounded-lg md:shadow-[0_2px_12px_0] md:shadow-dark-500/5"
    >
      <div className="mt-2 grid h-[300px] grid-cols-6 gap-2 overflow-scroll px-4">
        {years.map((year: number, index: number) => {
          const isActive = selectingYOB === year || false
          return (
            <div
              onClick={() => {
                onSelectYOB(year)
              }}
              className={classNames(
                `px-3 py-2 ${
                  isActive ? `border-[1px] border-[#0033C9]` : `border-[#F2F7FF] bg-blue-25`
                } flex h-[40px] justify-center rounded-[100px]`
              )}
              key={index}
            >
              <label className={classNames(`${isActive ? `text-blue-500` : `text-dark-500`}`)}>
                {year}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default YOBListDropdown
