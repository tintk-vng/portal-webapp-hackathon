import axiosClient from '@/api-client/client'
import { API_PATH, AppID } from '@/constants/bill'

const EDUCATION_API_PATH = API_PATH[AppID.EDUCATION]

export const getFeeDetails = (params: {
  customerCode: string
  appId: number
  month: string
  billId: string
  supplierId: number
}) => {
  return `api/v1/products/${params.appId}/bills/${params.billId}/details?supplier_id=${params.supplierId}&customer_code=${params.customerCode}&month=${params.month}`
}

export const getStudentsPath = (params: {
  appId: number
  supplierId: number
  schoolCode: string
  studentName: string
  yob: string
  className: string
}) => {
  let _path = `api/v1/products/1111/suppliers/${params.supplierId}/schools/${params.schoolCode}/students?name=${params.studentName}`
  if (params.yob) {
    _path += `&year_of_birth=${params.yob}`
  }
  if (params.className) {
    _path += `&class_name=${params.className}`
  }
  return _path
}

const educationAPI = {
  getBillDetails(params: {
    billID: string
    supplierID: number
    customerCode: string
    month: string
  }) {
    const url = `${EDUCATION_API_PATH.GET_BILLS}/${params.billID}/details?supplier_id=${params.supplierID}&customer_code=${params.customerCode}&month=${params.month}`
    return axiosClient.get(url)
  },

  getProviders(params: { supplierID: number }) {
    const url = `${EDUCATION_API_PATH.GET_SUPPLIERS}/${params.supplierID}/schools`
    return axiosClient.get(url)
  },

  getStudents(params: {
    appId: number
    supplierId: number
    schoolCode: string
    studentName: string
    yob: string
    className: string
  }) {
    const url = getStudentsPath(params)

    return axiosClient.get(url)
  },
}

export default educationAPI
