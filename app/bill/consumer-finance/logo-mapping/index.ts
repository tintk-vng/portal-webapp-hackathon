import { cpsImageUrlWithPath } from '@/utils/bill'

export const getBillDemo = (imageName: string = 'cf_fecredit_t_1') => {
  let imagePath = `consumer_finance/${imageName}.png`
  const url = cpsImageUrlWithPath(imagePath)
  return url
}
