import commonUtil from '@/utils/common'

const internetModel = {
  modelSupplierGroups: (data: any): any[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { supplier_groups, suppliers } = data
      const supplierGroups = new Map<string, any>()
      supplier_groups.forEach((group: any) => {
        supplierGroups.set(group.supplier_group_id, {
          ID: group.supplier_group_id.toString(),
          name: group.name ?? '',
          icon: group.icon,
          suppliers: [],
        })
      })
      suppliers.forEach((supplier: any) => {
        if (supplier.group_id) {
          // supplier.icon = cpsImageUrlWithPath(`internet/${supplier.icon}.png`)
          const group = supplierGroups.get(supplier.group_id)
          if (group) {
            group.suppliers.push({
              ID: supplier.supplier_id,
              name: supplier.name,
              status: supplier.status,
              icon: supplier.icon,
              queryTypes: supplier.query_types,
            })
          }
        } else {
          supplierGroups.set(`${supplier.supplier_id}`, {
            ID: supplier.supplier_id.toString(),
            name: supplier.name ?? '',
            icon: supplier.icon,
            suppliers: [
              {
                ID: supplier.supplier_id,
                name: supplier.name,
                status: supplier.status,
                icon: supplier.icon,
                queryTypes: supplier.query_types,
              },
            ],
          })
        }
      })
      return Array.from(supplierGroups.values()).filter(({ suppliers }) => suppliers.length > 0)
    } catch (error) {
      console.log('Failed to model group suppliers: ', error)
      return []
    }
  },
}

export default internetModel
