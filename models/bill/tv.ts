import { SupplierGroup } from '@/types/bill/internet'
import { cpsImageUrlWithPath } from '@/utils/bill'
import commonUtil from '@/utils/common'

const tvModel = {
  modelSupplierGroups: (data: any): any[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { supplier_groups, suppliers } = data
      const mappedGroup = new Map<string, SupplierGroup>()
      supplier_groups.forEach((group: any) => {
        mappedGroup.set(`${group.supplier_group_id}`, {
          supplier_group_id: `${group.supplier_group_id}`,
          name: group.name ?? '',
          icon: cpsImageUrlWithPath(`logo/${group.icon}.png`),
          suppliers: [],
        })
      })
      suppliers.forEach((supplier: any) => {
        if (supplier.group_id) {
          supplier.icon = supplier.icon
          const group = mappedGroup.get(`${supplier.group_id}`)
          if (group) {
            group.suppliers.push(supplier)
          }
        } else {
          mappedGroup.set(`${supplier.supplier_id}`, {
            supplier_group_id: `${supplier.supplier_id}`,
            name: supplier.name ?? '',
            icon: cpsImageUrlWithPath(`logo/${supplier.icon}.png`),
            suppliers: [{ ...supplier, icon: supplier.icon }],
          })
        }
      })
      return Array.from(mappedGroup.values()).filter(({ suppliers }) => suppliers.length > 0)
    } catch (error) {
      console.log('Failed to model group suppliers: ', error)
      return []
    }
  },
  modelCatalog: (data: any): string[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { catalogs = [] } = data
      return catalogs
    } catch (error) {
      console.log('Failed to model group suppliers: ', error)
      return []
    }
  },
}

export default tvModel
