'use client'

import billAPI from '@/api-client/bill'
import { DialogState } from '@/components/common/dialog'
import Input, { InputStatus } from '@/components/common/input'
import { API_PATH, AppID, ProductID } from '@/constants/bill'
import useCustomSWR from '@/hooks/use-custom-swr'
import billModel from '@/models/bill'
import waterModel from '@/models/bill/water'
import { useWaterStore } from '@/store/bill'
import { IError } from '@/types/bill'
import { Supplier, SupplierGroup } from '@/types/bill/water'
import { Captcha } from '@/types/common'
import { b64EncodeUnicode } from '@/utils/bill'
import commonUtil from '@/utils/common'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import CaptchaInput from '../../components/captcha-input'
import State, { mapStateViewByCodeAndReason, mapTitleByCodeAndReason } from '../../components/state'
import SubmitButton from '../../components/submit-button'
import Loading from '../loading'
import ExampleBill from './components/example-bill'
import SupplierGroupSelect from './components/supplier-group-select'
import SupplierSelect from './components/supplier-select'

type FormValues = {
  customerCode: string
  supplier: Supplier | undefined
  captchaCode: string
}

export default function WaterInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  const updateBillInfo = useWaterStore((state) => state.updateBillInfo)
  const updateSupplier = useWaterStore((state) => state.updateSupplier)
  const methods = useForm<FormValues>({
    defaultValues: {
      customerCode: '',
      supplier: undefined,
      captchaCode: '',
    } as FormValues,
  })
  const defaultSupplierID = searchParams?.get('supplierid')
  const [selectedSupplierGroup, setSelectedSupplierGroup] = useState<SupplierGroup>(
    {} as SupplierGroup
  )
  const [isLoading, setIsLoading] = useState(false)
  const [captcha, setCaptcha] = useState<Captcha | undefined>(undefined)
  const [billInfoError, setBillInfoError] = useState<IError | undefined>(undefined)
  const {
    data,
    error,
    isLoading: areSuppliersLoading,
  } = useCustomSWR(API_PATH[AppID.WATER].GET_SUPPLIERS, () =>
    billAPI.getSuppliers({ appID: AppID.WATER })
  )
  const modeledSupplierGroups = waterModel.modelSupplierGroups(data)

  useEffect(() => {
    if (commonUtil.isEmpty(modeledSupplierGroups)) {
      return
    }
    if (defaultSupplierID) {
      const selectedSupplierGroup = modeledSupplierGroups.find((group) =>
        group.suppliers.some((supplier) => supplier.ID === defaultSupplierID)
      )
      if (selectedSupplierGroup) {
        setSelectedSupplierGroup(selectedSupplierGroup)
        methods.setValue(
          'supplier',
          selectedSupplierGroup.suppliers?.find((supplier) => supplier.ID === defaultSupplierID)
        )
        if (
          selectedSupplierGroup.suppliers.findIndex(
            (supplier) => supplier.ID === defaultSupplierID
          ) === -1
        ) {
          methods.setValue('supplier', selectedSupplierGroup.suppliers[0])
        }
        return
      }
    }
    setSelectedSupplierGroup(modeledSupplierGroups[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, defaultSupplierID])

  if (areSuppliersLoading) {
    return <Loading />
  }

  if (error || billInfoError?.code) {
    const type = mapStateViewByCodeAndReason(
      billInfoError?.code || 200,
      billInfoError?.reason || ''
    )

    const handleButtonClick = () => {
      window.location.reload()
    }
    const customerCode = methods.getValues('customerCode')
    const supplier = methods.getValues('supplier')
    const deeplink = `https://onelink.zalopay.vn/nuoc?view=detail&customercode=${customerCode}&supplierid=${supplier?.ID}&appid=${AppID.WATER}&act=open_cashier&from_source=webside_dgs`
    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.WATER,
          deeplink,
          title:
            mapTitleByCodeAndReason(billInfoError?.code || 200, billInfoError?.reason || '') ||
            billInfoError?.message ||
            '',
          description: billInfoError?.description || '',
          onButtonClick: handleButtonClick,
        }}
      />
    )
  }

  const { getValues, resetField, setValue, setError, clearErrors, handleSubmit } = methods

  const handleBillInfoQuery = (failureCallback: (state: DialogState) => void) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    handleSubmit(
      async (data) => {
        try {
          const { customerCode, captchaCode } = data
          const selectedSupplier = getValues('supplier')
          const supplierID = Number(selectedSupplier!.ID)
          const response = await billAPI.getBillInfo({
            appID: AppID.WATER,
            supplierID,
            customerCode,
            captcha: captcha!,
            captchaCode,
          })
          updateBillInfo(response)
          updateSupplier(selectedSupplier!)
          setIsLoading(false)
          const encrypt = searchParams?.get('encrypt') || ''
          const voucherToken = searchParams?.get('voucherToken') || ''
          let url = `/nuoc/chi-tiet-hoa-don?supplierid=${supplierID}&customercode=${b64EncodeUnicode(
            customerCode
          )}&encrypt=${encrypt}&voucherToken=${voucherToken}`
          if (utmSource) {
            url += `&utm=${utmSource}`
          }
          router.push(url)
        } catch (error: any) {
          console.log('Failed to query bill info: ', error)
          const errorCode = error.response?.data.error.code || error.code
          if (errorCode === 401) {
            setError('captchaCode', { message: 'Mã xác nhận không đúng' })
          } else if (isNaN(errorCode) || errorCode < 500) {
            failureCallback({
              visible: true,
              description:
                error.response?.data.error.detail.description ||
                error.response.data.error.message ||
                error?.message,
            })
          } else {
            const updatedError = billModel.modelError(error.response.data.error)
            setBillInfoError(updatedError)
          }
          setValue('captchaCode', '')
          setCaptcha(undefined)
          setIsLoading(false)
        }
      },
      (e) => {
        setIsLoading(false)
      }
    )()
  }

  const handleSupplierGroupSelect = (selectedSupplierGroup: SupplierGroup) => {
    setSelectedSupplierGroup(selectedSupplierGroup)
    resetField('supplier')
  }

  return (
    <div>
      <div className="mb-3 text-xl font-bold md:mb-6 md:text-heading-lg">
        Nhập thông tin hoá đơn
      </div>

      <FormProvider {...methods}>
        <SupplierGroupSelect
          supplierGroups={modeledSupplierGroups}
          currentSupplierGroup={selectedSupplierGroup}
          onSupplierGroupSelect={handleSupplierGroupSelect}
        />

        {!commonUtil.isEmpty(selectedSupplierGroup) && (
          <SupplierSelect suppliers={selectedSupplierGroup.suppliers} />
        )}

        <CaptchaInput
          productID={ProductID.WATER}
          appID={AppID.WATER}
          captcha={captcha}
          onCaptchaChange={setCaptcha}
        >
          <Controller
            control={methods.control}
            name="customerCode"
            rules={{
              required: 'Bạn chưa nhập mã khách hàng',
            }}
            render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
              <Input
                ref={ref}
                value={value}
                label="Mã khách hàng"
                placeholder="Nhập mã khách hàng"
                status={InputStatus.ERROR}
                message={error?.message as string}
                required
                autoFocus
                onChange={(e) => {
                  let customerCode = e.toLocaleUpperCase()
                  if (!customerCode) {
                    onChange('')
                    clearErrors(name)
                    return
                  }
                  onChange(customerCode)
                }}
              />
            )}
          />
        </CaptchaInput>

        <ExampleBill selectedSupplierGroup={selectedSupplierGroup} />

        <SubmitButton text="Tiếp tục" onClick={handleBillInfoQuery} />
      </FormProvider>
    </div>
  )
}
