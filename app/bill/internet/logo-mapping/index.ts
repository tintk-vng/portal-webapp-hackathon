import { cpsImageUrlWithPath } from '@/utils/bill'
import logoMapping from './logo-mapping'

export const getNameBillDemo = (defaultImage = 'internet_default.jpg', supplierid = -1) => {
  return logoMapping[supplierid] ?? defaultImage
}

export const getBillDemo = (imageName = 'internet_vnpt_hcm', supplierid = -1) => {
  const name = getNameBillDemo(imageName, supplierid)
  let imagePath = `internet/${name}.png`
  const url = cpsImageUrlWithPath(imagePath)
  return url
}
