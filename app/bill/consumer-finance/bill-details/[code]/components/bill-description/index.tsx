'use client'
import RowInfo from '@/app/bill/components/row-info'
import Warning from '@/app/bill/components/warning'
import Image from '@/components/common/image'
import Input, { InputStatus } from '@/components/common/input'
import infoIcon from '@/public/images/icons/primary_info.svg'
import { IPaymentSelection } from '@/types/bill/consumer-finance'
import commonUtil from '@/utils/common'
import { IBill } from '@/types/bill'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import CheckBoxIcon from '../../../../components/check-box'
import { convertAmountStringToInt } from '../../../../utils'
import Tooltip from '../tooltip'
import { useFormContext } from 'react-hook-form'
import { CFContractType } from '@/constants/bill'
import SupplierInform from '../supplier-inform'
import DueDate from '../due-date'
interface IBillDescription {
  supplierID: number
  paymentOptions?: Array<IPaymentSelection>
  selectingPaymentOpt: IPaymentSelection | null
  onChangePaymentOpt: Function
  expiredDate: string
  contractType: CFContractType
  firstBill: IBill
}
const BillDescription = ({
  supplierID,
  paymentOptions = [],
  selectingPaymentOpt,
  onChangePaymentOpt = () => {},
  expiredDate = '',
  contractType,
  firstBill,
}: IBillDescription) => {
  const { setValue } = useFormContext()
  const [errorMessage, setErrorMessage] = useState('')
  const [inputAmount, setInputAmount] = useState('')
  const {
    installment = {
      max_input: 0,
      total_debt: 0,
      min_input: 0,
      month_string: '',
    },
    month_string: monthString = '',
    payment_fee,
  } = firstBill
  const {
    max_input: maxInput = 0,
    total_debt: totalDebt = 0,
    min_input: minInput = 0,
  } = installment

  useEffect(() => {
    if (selectingPaymentOpt?.id !== 4) {
      setValue('amount', selectingPaymentOpt?.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectingPaymentOpt?.id])

  function updateInputAmountOption(amount: number, valid: boolean = true) {
    setValue('amount', amount)
    onChangePaymentOpt({ id: 4, value: valid ? amount : -1, label: 'Nhập số khác' })
  }

  const onInputAmount = (e: any) => {
    const NON_NUMBER_REGEX = /[^0-9\.]/g
    let value = e.replace(NON_NUMBER_REGEX, '')
    setInputAmount(value)
    const parsedValue = isNaN(Number(value)) ? 0 : Number(value)
    if (parseInt(value) < minInput) {
      setErrorMessage(`Cần tối thiểu ${commonUtil.formatCurrency(minInput)} để thực hiện giao dịch`)
      updateInputAmountOption(parsedValue, false)
      return
    }
    if (totalDebt > 0 && parseInt(value) > totalDebt) {
      setErrorMessage('Số tiền bạn vừa nhập lớn hơn tổng dư nợ')
      updateInputAmountOption(parsedValue, false)
      return
    }
    if (maxInput > 0 && parseInt(value) > maxInput) {
      setErrorMessage(
        `Số tiền thanh toán lớn hơn hạn mức giao dịch tối đa ${commonUtil.formatCurrency(maxInput)}`
      )
      updateInputAmountOption(parsedValue, false)
      return
    }
    setErrorMessage('')
    updateInputAmountOption(parsedValue, true)
  }

  const onBlurInputAmount = () => {
    let value = convertAmountStringToInt(inputAmount)
    if (value > 0) {
      setInputAmount(commonUtil.formatCurrency(value))
    } else {
      setInputAmount('')
    }
  }

  const onFocusInputAmount = (paymentOption: IPaymentSelection) => {
    onChangePaymentOpt(paymentOption)
    if (inputAmount === '') {
      setInputAmount('')
    } else {
      const NON_NUMBER_REGEX = /[^0-9\.]/g
      let value = inputAmount.replace(NON_NUMBER_REGEX, '')
      setInputAmount(convertAmountStringToInt(value).toString())
    }
  }

  const onClearInputAmount = () => {
    setInputAmount('')
    updateInputAmountOption(0, true)
  }

  const onClickPaymentOption = (paymentOption: IPaymentSelection) => {
    if (paymentOption?.id === 4) {
      const currentInputAmount = convertAmountStringToInt(inputAmount) || 0
      updateInputAmountOption(currentInputAmount, true)
      return
    }
    onChangePaymentOpt({ ...paymentOption, value: paymentOption.value })
  }

  return (
    <>
      <div className="pb-4 md:pb-0">
        <p className="mb-3 text-base font-bold md:mb-2">Thông tin kỳ thanh toán {monthString}</p>
        {expiredDate && <DueDate dueDate={expiredDate} />}
        {paymentOptions.map(
          (
            paymentOption: IPaymentSelection,
            index: number,
            paymentOptions: IPaymentSelection[]
          ) => {
            return (
              <div
                key={paymentOption.id + index + paymentOption.label}
                className="divide-y divide-dark-50 text-label-md md:text-label-lg"
              >
                <RowInfo underline={index < paymentOptions.length - 2}>
                  <div className="flex w-full">
                    <div
                      onClick={() => {
                        onClickPaymentOption(paymentOption)
                      }}
                      className={classNames(
                        `${paymentOption.id === 4 && 'h-[50px]'} mr-3 flex items-center`
                      )}
                    >
                      <CheckBoxIcon isSelected={selectingPaymentOpt?.id === paymentOption.id} />
                    </div>
                    {paymentOption.id !== 4 ? (
                      <div
                        onClick={() => {
                          onClickPaymentOption(paymentOption)
                        }}
                        className="flex items-center"
                      >
                        <label className="mr-2 text-base">{paymentOption.label}</label>
                        {paymentOption.id === 3 && contractType === CFContractType.Card && (
                          <Tooltip title="Số tiền tối thiểu cần thanh toán để tiếp tục dùng thẻ">
                            <Image src={infoIcon} alt="icon-info" />
                          </Tooltip>
                        )}
                      </div>
                    ) : (
                      <Input
                        className="w-full"
                        onChange={onInputAmount}
                        onBlur={onBlurInputAmount}
                        onFocus={() => {
                          let _paymentOption = {
                            ...paymentOption,
                            value: convertAmountStringToInt(inputAmount) || 0,
                          }
                          onFocusInputAmount(_paymentOption)
                        }}
                        onClear={onClearInputAmount}
                        message={errorMessage || ' '}
                        value={inputAmount}
                        placeholder={paymentOption.label}
                        status={errorMessage !== '' ? InputStatus.ERROR : InputStatus.DEFAULT}
                      />
                    )}
                  </div>
                  {paymentOption.id !== 4 && (
                    <label
                      onClick={() => {
                        onClickPaymentOption(paymentOption)
                      }}
                      className="w-[30%] text-right font-bold"
                    >
                      {commonUtil.formatCurrency(paymentOption.value)}
                    </label>
                  )}
                </RowInfo>
              </div>
            )
          }
        )}
      </div>
      <SupplierInform supplierID={supplierID} paymentFee={payment_fee} />
    </>
  )
}
export default BillDescription
