'use client'

import billAPI from '@/api-client/bill'
import { DialogState } from '@/components/common/dialog'
import ErrorBoundary from '@/components/layout/error-boundary'
import { API_PATH, AppID } from '@/constants/bill'
import useCustomSWR from '@/hooks/use-custom-swr'
import billModel from '@/models/bill'
import internetModel from '@/models/bill/internet'
import { useInternetStore } from '@/store/bill'
import { IError, Supplier, SupplierGroup } from '@/types/bill'
import { Captcha } from '@/types/common'
import { b64EncodeUnicode } from '@/utils/bill'
import commonUtil from '@/utils/common'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import State, { mapStateViewByCodeAndReason, mapTitleByCodeAndReason } from '../../components/state'
import SubmitButton from '../../components/submit-button'
import Loading from '../loading'
import ExampleBill from './components/example-bill'
import QueryInput from './components/query-input'
import QueryTypeSelect from './components/query-type-select'
import SupplierGroupSelect from './components/supplier-group-select'
import SupplierSelect from './components/supplier-select'

type FormValues = {
  customerCode: string
  phone: string
  captchaCode: string
}

export default function CustomerInput() {
  const router = useRouter()
  const updateBillInfo = useInternetStore((state) => state.updateBillInfo)
  const updateSupplier = useInternetStore((state) => state.updateSupplier)
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  const defaultSupplierID = Number(searchParams?.get('supplierid') || undefined)
  const {
    data,
    error,
    isLoading: areSuppliersLoading,
  } = useCustomSWR(API_PATH[AppID.INTERNET].GET_SUPPLIERS, () =>
    billAPI.getSuppliers({ appID: AppID.INTERNET })
  )
  const modeledSupplierGroups = internetModel.modelSupplierGroups(data)
  const methods = useForm<FormValues>({
    defaultValues: {
      customerCode: '',
      phone: '',
      captchaCode: '',
    } as FormValues,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [captcha, setCaptcha] = useState<Captcha | undefined>(undefined)
  const [selectedSupplierGroup, setSelectedSupplierGroup] = useState<SupplierGroup>(
    modeledSupplierGroups[0]
  )
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>(
    modeledSupplierGroups[0]?.suppliers[0]
  )
  const [billInfoError, setBillInfoError] = useState<IError | undefined>(undefined)

  useEffect(() => {
    if (commonUtil.isEmpty(modeledSupplierGroups)) {
      return
    }
    if (!isNaN(defaultSupplierID)) {
      const supplierGroup = modeledSupplierGroups.find(({ suppliers }) =>
        Boolean(suppliers.find(({ ID }: { ID: number }) => ID === defaultSupplierID))
      )
      if (supplierGroup) {
        setSelectedSupplierGroup(supplierGroup)
        setSelectedSupplier(
          supplierGroup?.suppliers?.find(({ ID }: { ID: number }) => ID === defaultSupplierID) ||
            supplierGroup?.suppliers[0] ||
            null
        )
      }
    } else {
      setSelectedSupplierGroup(modeledSupplierGroups[0])
      setSelectedSupplier(modeledSupplierGroups[0].suppliers[0])
    }
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
    const supplierID = Number(selectedSupplier!.ID)
    const deeplink = `https://onelink.zalopay.vn/internet?view=detail&customercode=${customerCode}&supplierid=${supplierID}&appid=${AppID.INTERNET}&act=open_cashier&from_source=webside_dgs`
    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.INTERNET,
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

  const { setValue, setError, reset, handleSubmit } = methods

  const handleSupplierGroupChange = (supplierGroup: SupplierGroup) => {
    setSelectedSupplierGroup(supplierGroup)
    setSelectedSupplier(supplierGroup.suppliers[0])
    reset()
  }

  const handleBillInfoQuery = (failureCallback: (state: DialogState) => void) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    handleSubmit(
      async (data) => {
        try {
          const { customerCode, phone, captchaCode } = data
          const supplierID = Number(selectedSupplier!.ID)
          const response = await billAPI.getBillInfo({
            appID: AppID.INTERNET,
            supplierID,
            customerCode,
            phoneNumber: phone,
            captcha: captcha!,
            captchaCode,
          })
          updateBillInfo(response)
          updateSupplier(selectedSupplier!)
          setIsLoading(false)
          let url = `/internet/chi-tiet-hoa-don?supplierid=${supplierID}&customercode=${b64EncodeUnicode(
            data.customerCode
          )}`
          if (data.phone) {
            url += `&phonenumber=${data.phone}`
          }
          const encrypt = searchParams?.get('encrypt') || ''
          const voucherToken = searchParams?.get('voucherToken') || ''
          if (encrypt) {
            url += `&encrypt=${encrypt}`
          }
          if (voucherToken) {
            url += `&voucherToken=${voucherToken}`
          }
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

  return (
    <ErrorBoundary appID={AppID.INTERNET}>
      <div className="mb-3 text-xl font-bold md:mb-6 md:text-heading-lg">
        Nhập thông tin hoá đơn
      </div>

      <FormProvider {...methods}>
        {!commonUtil.isEmpty(modeledSupplierGroups) && (
          <>
            <SupplierGroupSelect
              supplierGroups={modeledSupplierGroups}
              selectedSupplierGroup={selectedSupplierGroup}
              onSelectedGroupChange={handleSupplierGroupChange}
            />

            {(() => {
              if (!selectedSupplierGroup) {
                return null
              }
              return (
                <>
                  {/* TODO: Why 2? */}
                  {selectedSupplierGroup.suppliers.length > 2 && (
                    <SupplierSelect
                      selectedSupplierGroup={selectedSupplierGroup}
                      selectedSupplier={selectedSupplier}
                      onSelectedSupplierChange={setSelectedSupplier}
                    />
                  )}
                  {/* TODO: Why 2? */}
                  {selectedSupplierGroup.suppliers.length === 2 && (
                    <QueryTypeSelect
                      selectedSupplierGroup={selectedSupplierGroup}
                      selectedSupplier={selectedSupplier}
                      onSelectedSupplierChange={setSelectedSupplier}
                    />
                  )}

                  <QueryInput
                    selectedSupplier={selectedSupplier}
                    captcha={captcha}
                    onCaptchaChange={setCaptcha}
                  />

                  <ExampleBill selectedSupplier={selectedSupplier} />
                </>
              )
            })()}
          </>
        )}

        <SubmitButton text="Tiếp tục" onClick={handleBillInfoQuery} />
      </FormProvider>
    </ErrorBoundary>
  )
}
