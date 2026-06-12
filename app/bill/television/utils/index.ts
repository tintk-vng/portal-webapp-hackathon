import { SupplierIds } from "../const"

export const hidingBillDemo=(supplierId: number)=>{
    const _hidingIds = [SupplierIds.VietCredit]
    return !(_hidingIds.findIndex((ids: number)=> ids === supplierId) > -1)
}

export const convertAmountStringToInt = (amountString: string) => {
    if (amountString.includes('đ')) {
      amountString = amountString.slice(0, -1)
    }
    return parseInt(amountString.split('.').join(''))
  }