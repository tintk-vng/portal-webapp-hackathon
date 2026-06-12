import { AppID } from '@/constants/bill'

export interface Department {
  code: string
  name: string
  address: string
}

interface EducationBillInfo {
  appID: AppID
  bills: IBill[]
  customerCode: string
  customerName: string
  address: string
  paymentRule: number
  providerCode: string
  supplierID: number
  totalAmount: number
  identityNumber: string
  schoolName: string
  className: string
  dateOfBirth: string
  updateAt?: number
}

interface PeriodDetails {
  bills: { ID: string; description: string; month: string; amount: number }[]
}

export interface IStudent {
  address: string
  birthday: string
  class_code: string
  class_name: string
  name: string
  phone_number: string
  student_id: string
}
