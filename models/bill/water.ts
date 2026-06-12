import { SupplierGroup } from '@/types/bill/water'
import { cpsImageUrlWithPath } from '@/utils/bill'
import commonUtil from '@/utils/common'

const waterModel = {
  modelSupplierGroups: (data: any) => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { supplier_groups, suppliers } = data
      const supplierGroups = new Map<string, SupplierGroup>()
      supplier_groups.forEach((group: any) => {
        supplierGroups.set(`${group.supplier_group_id}`, {
          ID: `${group.supplier_group_id}`,
          name: (group.name ?? '').replace('Nước ', ''),
          icon: group.icon,
          suppliers: [],
        })
      })
      const testGroupID: string = 'others'
      supplierGroups.set(testGroupID, { ID: testGroupID, name: 'Khác', suppliers: [] })
      suppliers.forEach((supplier: any) => {
        const group = supplierGroups.get(`${supplier.group_id || testGroupID}`)
        if (!commonUtil.isEmpty(group)) {
          group?.suppliers.push({
            ID: `${supplier.supplier_id}`,
            name: supplier.name,
            icon: supplier.icon,
            status: supplier.status,
          })
        }
      })
      if (supplierGroups.get(testGroupID)?.suppliers.length == 0) {
        supplierGroups.delete(testGroupID)
      }
      return Array.from(supplierGroups.values())
    } catch (error) {
      console.log('Failed to model supplier groups: ', error)
      return []
    }
  },
}

export default waterModel
