export interface IPaymentSelection {
  id: number
  label: string
  value: number
}

export interface IContract {
  company_name: string
  contract_number: string
  due_date: string
  min_amount: number
  month: string
  payment_amount: number
}
