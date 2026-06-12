interface ArgsQueryTypes {
  format: string
  label: string
  name: string
}

export interface QueryTypes {
  args: Array<ArgsQueryTypes>
  sample_bill_link: string
  name: string
  type: number
  supplierID?: number
}

export interface Supplier {
  supplier_id: number
  name: string
  icon?: string
  status: string
  group_id?: number
  query_types: QueryTypes[]
  suppliers: [Supplier]
}

export interface SupplierGroup {
  supplier_group_id: number
  icon: string
  name: string
}

export interface IPaymentSelection {
  id: number
  label: string
  value: number
}

interface IExtendData {
  customerCode: string
  month: string
  billId: string
  supplierId: number
  totalAmount: number
}
export interface IPeriodSelectionItem {
  active: boolean
  label: string
  value: string
  onChange: Function
  disble: boolean
  underline: boolean
  extendData?: IExtendData | null
}
