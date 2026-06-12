export const convertAmountStringToInt = (amountString: string) => {
  if (amountString.includes('đ')) {
    amountString = amountString.slice(0, -1)
  }
  return parseInt(amountString.split('.').join(''))
}
