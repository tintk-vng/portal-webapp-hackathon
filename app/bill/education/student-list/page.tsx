'use client'
import educationAPI, { getStudentsPath } from '@/api-client/bill/education'
import Image from '@/components/common/image'
import { AppID } from '@/constants/bill'
import billModel from '@/models/bill'
import educationModel from '@/models/bill/education'
import { IStudent } from '@/types/bill/education'
import { b64DecodeUnicode, b64EncodeUnicode, cpsImageUrlWithPath, RespStatus } from '@/utils/bill'
import commonUtil from '@/utils/common'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import ErrorState from '../../components/error'
import MaintenanceState from '../../components/mantaince'
import ContractsLoading from './components/contracts-loading'
interface IStudentItem extends IStudent {
  iconUrl: string
  schoolName: string
}

const StudentList = () => {
  const searchParams = useSearchParams()
  const supplierID = parseInt(searchParams?.get('supplierid') || '0', 10)
  const yob = searchParams?.get('yob') || ''
  const schoolCode = searchParams?.get('school_code') || ''
  const schoolName = searchParams?.get('school_name') || ''
  const className = searchParams?.get('class_name') || ''
  const studentName = b64DecodeUnicode(searchParams?.get('student_name') ?? '')
  const icon = searchParams?.get('icon') || ''
  let imagePath = `logo/${icon}.png`
  const iconUrl = cpsImageUrlWithPath(imagePath)
  const getStudentsParams = {
    appId: AppID.EDUCATION,
    supplierId: supplierID,
    studentName,
    yob,
    schoolCode,
    className,
  }
  const {
    data: _students,
    error: _getStudentsError,
    isLoading,
  } = useSWR(
    getStudentsPath(getStudentsParams),
    () => educationAPI.getStudents(getStudentsParams),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      errorRetryCount: 2,
    }
  )
  const getStudentsError = billModel.modelError(
    _getStudentsError && _getStudentsError?.response && _getStudentsError?.response.data.error
  )
  const students = educationModel.modelStudents(_students)

  if (isLoading) {
    return <ContractsLoading />
  }

  const onClose = () => {
    history.back()
  }

  const onContractClick = (student: IStudent) => {
    location.href = `/hoc-phi/chi-tiet-hoa-don?supplierid=${supplierID}&customercode=${b64EncodeUnicode(
      student.student_id
    )}`
  }

  if (!commonUtil.isEmpty(getStudentsError)) {
    if (getStudentsError.code === RespStatus.Maintain) {
      return (
        <div className="flex flex-col items-center">
          <MaintenanceState
            onButtonClick={onClose}
            title={getStudentsError.message || undefined}
            description={getStudentsError.description || undefined}
          />
        </div>
      )
    }
    return (
      <ErrorState
        onButtonClick={onClose}
        title={getStudentsError.message || ''}
        description={getStudentsError?.description || ''}
      />
    )
  }

  return (
    <>
      <p className="mb-3 text-xl font-bold md:mb-6 md:text-2xl">Nhập thông tin hoá đơn</p>
      <div className="flex flex-col items-center gap-y-4 md:p-6 md:shadow-[0_2px_12px_0] md:shadow-dark-500/5 ">
        <div className="w-full">
          <p className="text-base font-bold">Chọn hợp đồng</p>
        </div>
        <div className="w-full" style={{ maxHeight: '64vh', overflow: 'scroll' }}>
          {students &&
            students.map((student: IStudent, index: number) => {
              return (
                <div
                  onClick={() => {
                    onContractClick(student)
                  }}
                  className="mb-3"
                  key={index}
                >
                  <StudentListItem {...student} iconUrl={iconUrl} schoolName={schoolName} />
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}

const StudentListItem = ({
  birthday = '',
  class_name = '',
  name = '',
  student_id = '',
  iconUrl = '',
  schoolName = '',
}: Partial<IStudentItem>) => {
  return (
    <div className="rounded-lg border border-dark-50 p-3">
      <div className="flex items-center">
        <Image src={iconUrl} alt="" width={36} height={36} loader={({ src }) => src} />
      </div>
      <div className="mt-6 flex justify-between">
        <label className="text-sm text-dark-300">Mã học sinh</label>
        <label className="text-sm font-bold text-dark-500">{student_id}</label>
      </div>
      {name && (
        <>
          <div className="my-3 h-[1px] bg-dark-50" />
          <div className="flex justify-between">
            <label className="text-sm text-dark-300">Họ và tên học sinh</label>
            <label className="text-sm text-dark-500">{name}</label>
          </div>
        </>
      )}
      {birthday && (
        <>
          <div className="my-3 h-[1px] bg-dark-50" />
          <div className="flex justify-between">
            <label className="text-sm text-dark-300">Ngày sinh</label>
            <label className="text-sm text-dark-500">{birthday}</label>
          </div>
        </>
      )}
      {schoolName && (
        <>
          <div className="my-3 h-[1px] bg-dark-50" />
          <div className="flex justify-between">
            <label className="text-sm text-dark-300">Trường học</label>
            <label className="text-sm text-dark-500">{schoolName}</label>
          </div>
        </>
      )}
      {class_name && (
        <>
          <div className="my-3 h-[1px] bg-dark-50" />
          <div className="flex justify-between">
            <label className="text-sm text-dark-300">Lớp</label>
            <label className="text-sm text-dark-500">{class_name}</label>
          </div>
        </>
      )}
    </div>
  )
}
export default StudentList
