import { cpsImageUrlWithPath } from '@/utils/bill'

export const getBillDemo = (imageName: string = 'cf_fecredit_t_1') => {
  let imagePath = `education/${imageName}.png`
  const url = cpsImageUrlWithPath(imagePath)
  return url
}
