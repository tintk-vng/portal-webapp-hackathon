import { DataPackageType, SUPPLIER_ORDER_BY_TELCO_CODE, TelcoCode } from '@/constants/telco'
import { DataPackage, DataSupplier, PackageGroup } from '@/types/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'

const comboModel = {
  modelSuppliers: (data: any): DataSupplier[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { suppliers } = data
      const modeledSuppliers: DataSupplier[] = suppliers.map((supplier: any) => ({
        telcoCode: supplier.telco_code,
        status: supplier.status,
        order: SUPPLIER_ORDER_BY_TELCO_CODE[supplier.telco_code as TelcoCode],
      }))
      const sortedSuppliers = telcoUtil.sortSuppliers(modeledSuppliers)
      return sortedSuppliers
    } catch (error) {
      console.log('Failed to model suppliers: ', error)
      return []
    }
  },

  modelPackages: (data: any): PackageGroup[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { group_packages } = data
      const packageGroups = group_packages.map((group: any) => ({
        ID: group.group_id,
        name: group.group_name,
        packages: group.packages
          .map((dataPackage: any) => {
            if (dataPackage.type === DataPackageType.EXCLUSIVE) {
              return null
            }

            return {
              ID: dataPackage.id,
              key: dataPackage.id,
              appID: dataPackage.app_id,
              telcoCode: dataPackage.telco_code,
              type: dataPackage.type,
              code: dataPackage.code,
              name: dataPackage.name,
              duration: dataPackage.duration,
              capacity: dataPackage.capacity,
              amount: dataPackage.amount,
              status: dataPackage.status,
              badgeText: dataPackage.badge?.value || '',
              features: dataPackage.features || [],
            } as DataPackage
          })
          .filter(Boolean),
      }))
      return packageGroups
    } catch (error) {
      console.log('Failed to model packages: ', error)
      return []
    }
  },
}

export default comboModel
