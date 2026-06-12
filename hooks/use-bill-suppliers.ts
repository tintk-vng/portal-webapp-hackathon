import { API_PATH, AppID } from '@/constants/bill'
import useCustomSWR from './use-custom-swr'
import billAPI from '@/api-client/bill'
import { useSearchParams } from 'next/navigation'
import { useMemo, useRef } from 'react'

export default function useBillSupplier<T = any[]>(appID: AppID, modelFunc?: (params: any) => T) {
  const { data, error, isLoading } = useCustomSWR(API_PATH[appID].GET_SUPPLIERS, () =>
    billAPI.getSuppliers({ appID })
  )
  const searchParams = useSearchParams()
  const filterSupplierIDs = useRef(
    decodeURIComponent(searchParams?.get('supplierids') || '')
      .split(',')
      .map(Number)
      .filter(Boolean)
  ).current
  const processedData = useMemo(() => {
    if (!Array.isArray(filterSupplierIDs) || filterSupplierIDs.length === 0) {
      return modelFunc ? modelFunc(data) : data
    }
    try {
      const { suppliers, ...otherData } = data as { suppliers: Supplier[] }
      const filteredSuppliers = suppliers.filter(({ supplier_id }) =>
        filterSupplierIDs.includes(supplier_id)
      )
      return modelFunc
        ? modelFunc({ suppliers: filteredSuppliers, ...otherData })
        : { suppliers: filteredSuppliers, ...otherData }
    } catch (error: any) {
      return modelFunc ? modelFunc(data) : data
    }
  }, [filterSupplierIDs, data, modelFunc])
  return {
    data,
    modelledData: processedData as T,
    error,
    isLoading,
  }
}

interface Supplier {
  supplier_id: number
  [T: string]: any
}
