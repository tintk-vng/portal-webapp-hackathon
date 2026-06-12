import CheckBoxIcon from '@/app/bill/components/check-box'
import Input from '@/components/common/input'
import StaticImage from '@/components/common/static-image'
import useOutsideClick from '@/hooks/use-outside-click'
import NotFound from '@/public/images/artworks/not_found.svg'
import { Department } from '@/types/bill/education'
import { cleanAccents } from '@/utils/bill'
import commonUtil from '@/utils/common'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface DepartmentsDropdownProps {
  visible: boolean
  label: string
  departments: Array<Department>
  onClose: Function
  onDepartmentSelect: (department: Department) => void
}

export default function DepartmentsDropdown({
  visible,
  label,
  departments = [],
  onClose,
  onDepartmentSelect,
}: DepartmentsDropdownProps) {
  const { getValues } = useFormContext()
  const [visibleDepartments, setVisibleDepartments] = useState(departments)
  const [keyword, setKeyword] = useState('')
  const departmentsDropdownRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(departmentsDropdownRef, onClose)

  useEffect(() => {
    setVisibleDepartments(departments)
  }, [departments])

  if (!visible) {
    return null
  }

  const handleSearch = (keyword: string) => {
    setKeyword(keyword)
    if (keyword === '') {
      setVisibleDepartments(departments)
    } else {
      const filteredDepartments = departments.filter((department: Department) =>
        cleanAccents(department.name)
          .toString()
          .toLowerCase()
          .includes(cleanAccents(keyword).toString().toLowerCase())
      )
      setVisibleDepartments(filteredDepartments)
    }
  }

  const selectedDepartment = getValues('department')

  return (
    <div
      ref={departmentsDropdownRef}
      className="absolute z-[100] mt-2 w-full bg-white-500 p-4 py-4 md:rounded-lg md:shadow-[0_2px_12px_0] md:shadow-dark-500/5"
    >
      <Input value={keyword} placeholder={`Tìm tên ${label}`} onChange={handleSearch} />

      <ul className="h-80 overflow-scroll">
        {visibleDepartments.map((department: Department, index: number) => {
          const { code, name, address } = department
          const isSelected = code === selectedDepartment?.code

          return (
            <li
              key={code + name + index}
              className="border-b border-dark-50 last:border-b-0"
              onClick={() => onDepartmentSelect(department)}
            >
              <div className="flex h-[62px] items-center justify-between py-3">
                <div className="flex flex-col items-start justify-center">
                  <label className="text-label-md">{name}</label>

                  <label className="text-label-md text-dark-300">{address}</label>
                </div>

                <CheckBoxIcon isSelected={isSelected} />
              </div>
            </li>
          )
        })}

        {keyword !== '' && commonUtil.isEmpty(visibleDepartments) && (
          <li className="flex flex-col items-center py-6">
            <StaticImage width={120} height={120} src={NotFound} alt="not-found-artwork" />

            <div className="mb-2 mt-6 text-label-lg font-bold">Không có kết quả phù hợp</div>

            <div className="text-label-md text-dark-300">Bạn hãy thử lại với từ khoá khác nhé</div>
          </li>
        )}
      </ul>
    </div>
  )
}
