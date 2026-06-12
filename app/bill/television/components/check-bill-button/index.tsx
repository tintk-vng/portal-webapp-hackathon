'use client'
import billAPI from '@/api-client/bill'
import ErrorContext from '@/app/bill/error-context'
import Button, { ButtonSize } from '@/components/common/button'
import { useTelevisionStore } from '@/store/bill'
import { Captcha } from '@/types/common'
import { b64EncodeUnicode } from '@/utils/bill'
import classNames from 'classnames'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'

export default function CheckBillButton({
  className = '',
  captcha,
}: {
  className?: string
  captcha: Captcha | undefined
}) {
  const updateBillInfo = useTelevisionStore((state) => state.updateBillInfo)
  const updateSupplier = useTelevisionStore((state) => state.updateSupplier)
  const { appID, handleError } = useContext(ErrorContext)
  const { handleSubmit } = useFormContext()

  const handleClick = handleSubmit(async (data) => {
    try {
      const { phone, customerCode, captchaCode, supplier } = data
      const supplierID = parseInt(supplier.supplier_id, 10)
      const response = await billAPI.getBillInfo({
        appID,
        supplierID,
        customerCode,
        phoneNumber: phone,
        captcha: captcha!,
        captchaCode,
      })
      updateBillInfo(response)
      updateSupplier(supplier)
      let url = `/truyen-hinh/chi-tiet-hoa-don?supplierid=${supplierID}&customercode=${b64EncodeUnicode(
        data.customerCode
      )}`
      if (!!data.phone) {
        url += `&phonenumber=${data.phone}`
      }
      location.href = url
    } catch (_error: any) {
      handleError(_error)
    }
  })

  return (
    <div
      className={classNames({
        'fixed bottom-0 left-0 right-0 z-10 bg-white-500 p-4 md:static md:z-0 md:p-0': true,
        [className]: !!className,
      })}
    >
      <Button width="w-full" size={ButtonSize.LARGE} onClick={handleClick}>
        Tiếp tục
      </Button>
    </div>
  )
}
