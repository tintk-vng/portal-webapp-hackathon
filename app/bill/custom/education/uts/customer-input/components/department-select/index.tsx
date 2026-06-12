import educationAPI from '@/api-client/bill/education'
import { API_PATH, AppID } from '@/constants/bill'
import useCustomSWR from '@/hooks/use-custom-swr'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import useToggle from '@/hooks/use-toggle'
import educationModel from '@/models/bill/education'
import { Department } from '@/types/bill/education'
import { Controller, useFormContext } from 'react-hook-form'
import SelectComponent from '../select-component'
import DepartmentsBottomSheet from './departments-bottom-sheet'
import DepartmentsDropdown from './departments-dropdown'

const FIELD_NAME = 'department'

export enum DepartmentType {
  DEPARTMENT = 'DEPARTMENT',
  SCHOOL = 'SCHOOL',
}

interface DepartmentSelectProps {
  type: DepartmentType
}

export default function DepartmentSelect({ type }: DepartmentSelectProps) {
  const { size } = useScreen()
  const {
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()
  const [visible, toggle] = useToggle()
  const selectedSupplier = getValues('supplier')
  const supplierID = selectedSupplier.ID || -1
  const { data, error, isLoading } = useCustomSWR(
    `${API_PATH[AppID.EDUCATION].GET_SUPPLIERS}/${supplierID}/schools`,
    () => educationAPI.getProviders({ supplierID: selectedSupplier.ID || -1 })
  )
  const departments = educationModel.modelDepartments(data)
  const label = type === DepartmentType.DEPARTMENT ? 'sở' : 'trường học'

  const handleDepartmentSelect = (department: Department) => {
    // setSelectingProvider(provider)
    setValue(FIELD_NAME, department)
    toggle()
    const errorMessage = errors[FIELD_NAME]?.message
    if (errorMessage) {
      clearErrors(FIELD_NAME)
    }
  }

  return (
    <div className="relative mb-2 w-full">
      <Controller
        control={control}
        name={FIELD_NAME}
        rules={{
          required: `Bạn chưa chọn ${label}`,
        }}
        render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
          <SelectComponent
            value={value?.name}
            placeholder={`Chọn ${label}`}
            icon={'https://scdn.zalopay.com.vn/zst/zpi/images/bill/portal/icons/general_down.svg'}
            errMsg={error?.message}
            onClick={toggle}
          />
        )}
      />

      {size === ScreenSize.SMALL ? (
        <DepartmentsBottomSheet
          visible={visible}
          label={label}
          departments={departments}
          onDepartmentSelect={handleDepartmentSelect}
          onClose={toggle}
        />
      ) : (
        <DepartmentsDropdown
          visible={visible}
          label={label}
          departments={departments}
          onDepartmentSelect={handleDepartmentSelect}
          onClose={toggle}
        />
      )}
    </div>
  )
}
