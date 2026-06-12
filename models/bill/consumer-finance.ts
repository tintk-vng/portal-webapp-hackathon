import commonUtil from '@/utils/common'
import { IContract } from '@/types/bill/consumer-finance'
import { QueryType, Supplier, SupplierGroup } from '@/types/bill'
import { CFContractType } from '@/constants/bill'

const consumerFinanceModel = {
  modelSupplierGroups: (data: any): Supplier[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { supplier_groups, suppliers } = data
      const supplierGroups = new Map<string, SupplierGroup>()
      supplier_groups.forEach((group: any) => {
        supplierGroups.set(group.supplier_group_id.toString(), {
          ID: group.supplier_group_id.toString(),
          name: group.name ?? '',
          icon: group.icon,
          suppliers: [],
        })
      })
      const processedSuppliers: Supplier[] = []
      suppliers.forEach((supplier: any) => {
        const modelledQueryTypes = supplier.query_types.map((queryType: any) => ({
          name: queryType.name,
          args: queryType.args,
          sampleBillUrl: queryType.sample_bill_link,
          type: queryType.type,
          supplierID: supplier.supplier_id,
        }))
        if (supplier.group_id) {
          const group = supplierGroups.get(supplier.group_id.toString())
          if (group) {
            group.suppliers.push({
              ID: supplier.supplier_id,
              name: supplier.name,
              status: supplier.status,
              icon: supplier.icon,
              queryTypes: modelledQueryTypes,
            })
          }
          return
        }
        processedSuppliers.push({
          ID: supplier.supplier_id.toString(),
          name: supplier.name ?? '',
          icon: supplier.icon,
          queryTypes: modelledQueryTypes,
        })
      })

      const suppliersInGroups = Array.from(supplierGroups.values())
        .filter(({ suppliers }) => suppliers.length > 0)
        .map((group) => {
          const { suppliers, ...other } = group
          return {
            ...other,
            queryTypes: suppliers.map(({ queryTypes }) => queryTypes).flat(),
          }
        }) as Supplier[]
      return [...processedSuppliers, ...suppliersInGroups]
    } catch (error) {
      console.log('Failed to model group suppliers: ', error)
      return []
    }
  },
  modelBillInfo: (data: any) => {
    const billInfo = {
      appID: 0,
      bills: [],
      customerCode: '',
      address: '',
      customerName: '',
      paymentRule: 1,
      providerCode: '',
      supplierID: 0,
      totalAmount: 0,
      identityNumber: '',
      contractType: CFContractType.Default,
      contractExtInfo: '',
    }
    try {
      if (commonUtil.isEmpty(data)) {
        return billInfo
      }
      return {
        ...billInfo,
        appID: data.app_id,
        bills: data.bills,
        customerCode: data.customer_code,
        address: data.customer_address,
        customerName: data.customer_name,
        paymentRule: data.payment_rule,
        providerCode: data.provider_code,
        supplierID: data.supplier_id,
        totalAmount: data.total_amount,
        identityNumber: data.customer_identity_number,
        contractType: data?.contract_type,
        contractExtInfo: data?.contract_ext_info,
      }
    } catch (error) {
      console.log('Failed to model bill info: ', error)
      return billInfo
    }
  },
  modelContracts: (data: any): IContract[] => {
    try {
      if (commonUtil.isEmpty(data)) {
        return []
      }
      const { contracts } = data
      return contracts
    } catch (error) {
      console.log('Failed to model group suppliers: ', error)
      return []
    }
  },
}

export default consumerFinanceModel
