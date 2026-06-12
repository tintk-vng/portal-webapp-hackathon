import CheckBoxIcon from '@/app/bill/components/check-box'
import BottomSheet from '@/components/common/bottom-sheet'
import Input from '@/components/common/input'
import StaticImage from '@/components/common/static-image'
import NotFound from '@/public/images/artworks/not_found.svg'
import { Department } from '@/types/bill/education'
import { cleanAccents } from '@/utils/bill'
import commonUtil from '@/utils/common'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface DepartmentsBottomSheetProps {
  visible: boolean
  label: string
  departments: Array<Department>
  onDepartmentSelect: (department: Department) => void
  onClose: () => void
}
export default function DepartmentsBottomSheet({
  visible = false,
  label,
  departments = [],
  onDepartmentSelect = () => {},
  onClose,
}: DepartmentsBottomSheetProps) {
  const { getValues } = useFormContext()
  const [visibleDepartments, setVisibleDepartments] = useState(departments)
  const [keyword, setKeyword] = useState('')

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
    <>
      <BottomSheet title={`Chọn ${label}`} visible={visible} onClose={onClose}>
        <div>
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
                  <div className="flex h-[72px] items-center justify-between py-3">
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

                <div className="text-label-md text-dark-300">
                  Bạn hãy thử lại với từ khoá khác nhé
                </div>
              </li>
            )}
          </ul>
        </div>
      </BottomSheet>
    </>
  )
}
