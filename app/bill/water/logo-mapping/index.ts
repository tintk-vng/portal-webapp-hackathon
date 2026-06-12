import { cpsImageUrlWithPath } from '@/utils/bill'
import logoMaping from './logo-maping'

export const getNameBillDemo = (groupid = 0, supplierid = 11) => {
  if (logoMaping[supplierid]) {
    return logoMaping[supplierid]
  }
  switch (groupid) {
    case 11:
      return 'nuoc_cholon'
    case 12:
      return 'nuoc_hanoi'
    default:
      return 'nuoc_cholon'
  }
}

export const getBillDemo = (groupid = 0, supplierid = -1) => {
  const name = getNameBillDemo(groupid, supplierid)
  if (!name) {
    return ''
  }
  const imagePath = `water/${name}.png`
  const url = cpsImageUrlWithPath(imagePath)
  return url
}
