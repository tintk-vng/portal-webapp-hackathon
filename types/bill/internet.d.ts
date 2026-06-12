export interface Supplier {
  supplier_id: number
  name: string
  icon?: string
  status?: string
  group_id?: number
  query_types: {
    args: Array<{ format: string; label: string; name: string }>
    sample_bill_link: string
    name: string
    type: number
    supplierID?: number
  }[]
}

export interface SupplierGroup {
  supplier_group_id: string
  icon: string
  name: string
  suppliers: Supplier[]
}
