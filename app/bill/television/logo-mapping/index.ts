import { cpsImageUrlWithPath } from '@/utils/bill'
import logoMaping from './logo-maping'

export const getNameBillDemo = (suppliername = 'truyenhinh_htv', supplierid = -1) => {
  return logoMaping[supplierid] ?? suppliername
}

export const getBillDemo = (imageName: string = '', supplierid = -1) => {
  let name = getNameBillDemo(imageName, supplierid)
  if (!name) {
    name = 'truyenhinh_htv'
  }
  let imagePath = `television/${name}.png`
  const url = cpsImageUrlWithPath(imagePath)
  return url
}
