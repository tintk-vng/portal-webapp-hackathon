import { Supplier } from '@/types/bill'
import { EducationBillInfo, IStudent, PeriodDetails } from '@/types/bill/education'
import commonUtil from '@/utils/common'

const educationModel = {
  modelBillInfo: (data: any): EducationBillInfo => {
    try {
      if (commonUtil.isEmpty(data)) {
        return {} as EducationBillInfo
      }
      return {
        appID: data.app_id,
        bills: data.bills,
        customerCode: data.customer_code,
        address: data.customer_address,
        customerName: data.customer_name,
        identityNumber: data.customer_identity_number,
        dateOfBirth: data.customer_date_of_birth,
        className: data.customer_class_name,
        schoolName: data.customer_school_name,
        paymentRule: data.payment_rule,
        providerCode: data.provider_code,
        supplierID: data.supplier_id,
        totalAmount: data.total_amount,
      }
    } catch (error) {
      console.log('Failed to model bill info: ', error)
      return {} as EducationBillInfo
    }
  },

  modelPeriodDetails: (data: any): PeriodDetails => {
    const periodDetails = {
      bills: [],
    }
    try {
      if (commonUtil.isEmpty(data)) {
        return periodDetails
      }
      return {
        bills: data.bill_details.map((bill: any) => ({
          ID: bill.bill_detail_id,
          amount: bill.amount,
          month: bill.month,
          description: bill.description,
        })),
      }
    } catch (error) {
      console.log('Failed to model period details: ', error)
      return periodDetails
    }
  },

  modelSuppliers: (data: any) => {
    try {
      if (commonUtil.isEmpty(data?.suppliers)) {
        return []
      }
      return data.suppliers
        .map((supplier: any) => ({
          ID: supplier.supplier_id,
          name: supplier.name,
          status: supplier.status,
          icon: supplier.icon,
          queryTypes: supplier.query_types?.map((queryType: any) => ({
            supplierID: queryType.supplier_id,
            name: queryType.name,
            type: queryType.type,
            sampleBillUrl: queryType.sample_bill_link,
            args: queryType.args,
          })),
        }))
        .filter(
          (supplier: any) =>
            supplier.status === 'ACTIVE' ||
            supplier.status === 'MAINTENANCE' ||
            supplier.status === 'ACTIVE_HIDDEN'
        )
    } catch (error) {
      console.log('Failed to model suppliers: ', error)
      return []
    }
  },

  modelStudents: (data: any): IStudent[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { students } = data
      return students
    } catch (error) {
      console.log('Failed to model group suppliers: ', error)
      return []
    }
  },

  modelDepartments: (data: any) => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { schools } = data
      return schools
    } catch (error) {
      console.log('Failed to model departments: ', error)
      return []
    }
  },
}

export default educationModel
