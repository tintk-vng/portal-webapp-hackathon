import { PaymentRule } from '@/constants/common'
import { AppID, DataPackageType, PackageStatus, SupplierStatus, TelcoCode } from '@/constants/telco'

interface Supplier {
  telcoCode: TelcoCode
  status: SupplierStatus
  badgeText?: string
  order?: number
  logo?: string
}

// Post Paid
interface PostPaidSupplier extends Supplier {
  ID: number
}

interface Bill {
  ID: string
  customerCode: string
  amount: number
  month: string
  minAmount: number
  maxAmount: number
}

interface BillInfo {
  appID: AppID
  bills: Bill[]
  customerCode: string
  paymentRule: PaymentRule
  providerCode: string
  supplierID: number
  totalAmount: number
  rawInfo: any
}

interface TopupSupplier extends Supplier {
  packages: DataPackage[]
}

// Data
interface DataPackage {
  ID: string
  appID: AppID
  telcoCode: TelcoCode
  type: DataPackageType
  code: string
  name: string
  amount: number
  capacity: {
    value: numnber
    unit: string
    display: string
  }
  duration: {
    value: numnber
    unit: string
    display: string
  }
  status: PackageStatus
  badgeText: string
  features: {
    title: string
    descriptions: string[]
  }[]
  extraInfo?: any
  originalAmount?: number
}

interface PackageGroup {
  ID: string
  name: string
  packages: DataPackage[]
}

interface DataSupplier extends Supplier {
  packageGroups: PackageGroup[]
}
