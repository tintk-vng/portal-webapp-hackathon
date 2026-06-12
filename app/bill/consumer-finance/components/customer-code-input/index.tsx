'use client'
import Input, { InputStatus } from '@/components/common/input'
import { QueryBillTypes } from '@/constants/bill'
import { QueryType } from '@/types/bill'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface ICustomerCodeInput {
  selectQueryTypes?: QueryType
}
export default function CustomerCodeInput({
  selectQueryTypes = {} as QueryType,
}: ICustomerCodeInput) {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()
  const FIELD_NAME = selectQueryTypes.type === QueryBillTypes.IDENTITY ? 'idNumber' : 'customerCode'
  const [customerCode, setCustomerCode] = useState('')
  const errorMessage = errors[FIELD_NAME]?.message as string

  const handleChange = (value: string) => {
    clearErrors(FIELD_NAME)
    setCustomerCode(value)
    setValue(FIELD_NAME, value)
  }

  return (
    <div>
      <input
        {...register(FIELD_NAME, {
          required: `Bạn chưa ${
            Object.keys(selectQueryTypes).length > 0
              ? selectQueryTypes.args[0].label.toLowerCase()
              : 'nhập mã khách hàng'
          }`,
        })}
        style={{ display: 'none' }}
      />

      <Input
        className=""
        type="text"
        label="Mã khách hàng"
        value={customerCode}
        placeholder={
          Object.keys(selectQueryTypes).length > 0
            ? selectQueryTypes.args[0].label
            : 'Nhập mã khách hàng'
        }
        status={errorMessage ? InputStatus.ERROR : InputStatus.DEFAULT}
        message={errorMessage}
        required
        onChange={handleChange}
      />
    </div>
  )
}
