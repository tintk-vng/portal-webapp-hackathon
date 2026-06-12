import { SupplierID } from '@/constants/bill'
import Warning from '@/app/bill/components/warning'
import commonUtil from '@/utils/common'

export default function SupplierInform({ supplierID, paymentFee }: SupplierInformProps) {
  const SupplierInformContent = mapSupplierInform[supplierID]
  if (!SupplierInformContent) {
    return null
  }
  return (
    <Warning title="Lưu ý:">
      <SupplierInformContent paymentFee={paymentFee} />
    </Warning>
  )
}

interface SupplierInformProps {
  supplierID: number
  paymentFee?: number
}

const mapSupplierInform: Partial<
  Record<number, (props: SupplierInformContentProps) => JSX.Element>
> = {
  [SupplierID.F88]: () => (
    <ul className="list-disc pl-4">
      <li>
        Khoản thanh toán của khách hàng sẽ được gạch nợ vào ngày đến hạn thanh toán trên hợp đồng
        vay theo quy định của F88.
      </li>
    </ul>
  ),
  [SupplierID.WelcomeDTC]: () => (
    <ul className="list-disc pl-4">
      <li>Dư nợ trong kỳ cần thanh toán nêu trên do Welcome DTC cung cấp.</li>
      <li>Khoản thanh toán của quý khách sẽ được gạch nợ theo quy định của Welcome DTC.</li>
    </ul>
  ),
  [SupplierID.SHBCard]: ({ paymentFee }: SupplierInformContentProps) => (
    <ul className="list-disc pl-4">
      <li>
        Để thanh toán đầy đủ dư nợ, vui lòng cộng thêm{' '}
        {commonUtil.formatCurrency(paymentFee || 0, true)} phí dịch vụ vào số tiền thanh toán.
      </li>
      <li>
        Khoản thanh toán của khách hàng sẽ được gạch nợ vào ngày đến hạn thanh toán theo quy định
        của SHBFinance.
      </li>
    </ul>
  ),
}

interface SupplierInformContentProps {
  paymentFee?: number
}
