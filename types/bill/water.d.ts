export interface Supplier {
  ID: string
  name: string
  icon?: string
  status?: string
  queryTypes?: any
}

export interface SupplierGroup {
  ID: string
  name: string
  icon?: string
  suppliers: Supplier[]
}
