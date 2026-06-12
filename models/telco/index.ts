import { DataPackageType, SUPPLIER_ORDER_BY_TELCO_CODE, TelcoCode } from '@/constants/telco'
import { DataPackage, DataSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'

const telcoModel = {
  modelPackage(dataPackage: any) {
    try {
      if (
        dataPackage.type === DataPackageType.EXCLUSIVE ||
        dataPackage.type === DataPackageType.DYNAMIC_AMOUNT
      ) {
        return null
      }

      return {
        ID: dataPackage.id,
        appID: dataPackage.app_id,
        telcoCode: dataPackage.telco_code,
        type: dataPackage.type,
        code: dataPackage.code,
        name: dataPackage.name,
        duration: dataPackage.duration,
        capacity: dataPackage.capacity,
        amount: dataPackage.amount,
        originalAmount: dataPackage.original_amount,
        status: dataPackage.status,
        badgeText: dataPackage.badge?.value || '',
        features: dataPackage.features || [],
      } as DataPackage
    } catch (error) {
      console.log('Failed to model package: ', error)
      return null
    }
  },

  modelSuppliers: (data: any): DataSupplier[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { suppliers } = data
      const modeledSuppliers: DataSupplier[] = suppliers.map((supplier: any) => ({
        telcoCode: supplier.telco_code,
        status: supplier.status,
        badgeText: supplier.badge?.value || '',
        order: SUPPLIER_ORDER_BY_TELCO_CODE[supplier.telco_code as TelcoCode],
        packageGroups: supplier.group_packages.map((group: any) => ({
          ID: group.group_id,
          name: group.group_name,
          packages: group.packages
            .map((dataPackage: any) => telcoModel.modelPackage(dataPackage))
            .filter(Boolean),
        })),
      }))
      const sortedSuppliers = telcoUtil.sortSuppliers(modeledSuppliers)
      return sortedSuppliers
    } catch (error) {
      console.log('Failed to model suppliers: ', error)
      return []
    }
  },
}

export default telcoModel
