import { PaymentRule } from '@/constants/common'

interface QueryType {
  supplierID: number
  name: string
  type: number
  sampleBillUrl: string
  args: {
    format: string
    label: string
    name: string
  }[]
}

interface Supplier {
  ID: string
  name: string
  icon?: string
  status?: string
  queryTypes?: QueryType[]
}

export interface SupplierGroup {
  ID: string
  name: string
  icon?: string
  suppliers: Supplier[]
}

interface ISupplier {
  icon: string
  name: string
  status: string
  supplier_id: number
}

interface ISuppliers {
  supplier_groups: ISupplier[]
  suppliers: ISuppliers[]
}

interface IBill {
  amount: number
  app_id: number
  bill_id: string
  bill_type: number
  customer_address: string
  customer_name: string
  cycle_type: number
  cycle_value: string
  description: string
  expired_date: string
  is_prepaid: boolean
  month: number
  month_string: string
  payment_fee: number
  payment_id: string
  payment_range: string
  query_date: number
  query_time: number
  service_id: string
  supplier_code: string
  installment?: {
    max_input: number
    min_input: number
    min_pay: number
    total_debt: number
    default: number
  }
  meter_index?: {
    new_index: number
    old_index: number
    unit: string
    usage: number
  }
  ex_info?: string
  apartment_fee?: {
    management_fee?: number
    parking_fee?: number
    water_fee?: number
    electric_fee?: number
    gas_fee?: number
    other_fee?: number
    old_dept?: number
    paid?: number
    service_fee?: number
  }
  package_name?: string
  description?: string
}

interface IBillInfo {
  appID: number
  bills: IBill[]
  customerCode: string
  customerName: string
  address: string
  paymentRule: number
  providerCode: string
  supplierID: number
  totalAmount: number
  updateAt?: number
  contractType?: string
  contractExtInfo?: string
}

interface IBillInfoCF extends IBillInfo {
  identityNumber?: string
}

interface IError {
  code?: number
  message?: string
  domain?: string
  reason?: string
  description?: string
}

interface IDialog {
  title: string
  subtitle: any
  actions: Array<IActionDialog>
  visible: boolean
  onClose: Function
}

interface IActionDialog {
  title: string
  action: Function
  type: ButtonType
}
