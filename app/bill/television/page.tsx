'use client'
import billAPI from '@/api-client/bill'
import CaptchaInput from '@/app/bill/components/captcha-input'
import { DialogState } from '@/components/common/dialog'
import Image from '@/components/common/image'
import { API_PATH, AppID, ProductID } from '@/constants/bill'
import useCustomSWR from '@/hooks/use-custom-swr'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import billModel from '@/models/bill'
import tvModel from '@/models/bill/tv'
import { useTelevisionStore } from '@/store/bill'
import { IError, Supplier } from '@/types/bill'
import { Captcha } from '@/types/common'
import { b64EncodeUnicode } from '@/utils/bill'
import commonUtil from '@/utils/common'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import State, { mapStateViewByCodeAndReason, mapTitleByCodeAndReason } from '../components/state'
import SubmitButton from '../components/submit-button'
import CustomerInput from './components/customer-input'
import SupplierSelect from './components/supplier-select'
import Loading from './loading'
import { getBillDemo } from './logo-mapping'

type FormValues = {
  supplier: any
  customerCode: string
  captchaCode: string
  phone: string
}

export default function TelevisionInput() {
  const router = useRouter()
  const updateBillInfo = useTelevisionStore((state) => state.updateBillInfo)
  const updateSupplier = useTelevisionStore((state) => state.updateSupplier)
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  const methods = useForm<FormValues>({
    defaultValues: {
      supplier: { ID: '0' } as Supplier,
      customerCode: '',
      captchaCode: '',
      phone: '',
    } as FormValues,
  })
  const {
    data,
    isLoading: areSuppliersLoading,
    error,
  } = useCustomSWR(API_PATH[AppID.TELEVISION].GET_SUPPLIERS, () =>
    billAPI.getSuppliers({ appID: AppID.TELEVISION })
  )
  const [supplierGroups, setSupplierGroups] = useState<any[]>([])
  const { size } = useScreen()
  const isMobile = size === ScreenSize.MEDIUM || size === ScreenSize.SMALL
  const [isLoading, setIsLoading] = useState(false)
  const [captcha, setCaptcha] = useState<Captcha | undefined>(undefined)
  const [billInfoError, setBillInfoError] = useState<IError | undefined>(undefined)
  useEffect(() => {
    const modeledSupplierGroups = tvModel.modelSupplierGroups(data)
    if (!commonUtil.isEmpty(modeledSupplierGroups)) {
      setSupplierGroups(modeledSupplierGroups)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
    const deeplink = `https://onelink.zalopay.vn/truyen-hinh?view=detail&customercode=${customerCode}&supplierid=${supplier?.ID}&appid=${AppID.TELEVISION}&act=open_cashier&from_source=webside_dgs`
    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.TELEVISION,
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

  const { setValue, setError, handleSubmit } = methods

  // const handleClick = handleSubmit(async (data) => {
  //   try {
  //     const { phone, customerCode, captchaCode, supplier } = data
  //     const supplierID = parseInt(supplier.supplier_id, 10)
  //     const response = await billAPI.getBillInfo({
  //       appID,
  //       supplierID,
  //       customerCode,
  //       phoneNumber: phone,
  //       captcha: captcha!,
  //       captchaCode,
  //     })
  //     updateBillInfo(response)
  //     updateSupplier(supplier)
  //     let url = `/truyen-hinh/chi-tiet-hoa-don?supplierid=${supplierID}&customercode=${b64EncodeUnicode(
  //       data.customerCode
  //     )}`
  //     if (!!data.phone) {
  //       url += `&phonenumber=${data.phone}`
  //     }
  //     location.href = url
  //   } catch (_error: any) {
  //     handleError(_error)
  //   }
  // })

  const handleBillInfoQuery = (failureCallback: (state: DialogState) => void) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    handleSubmit(
      async (data) => {
        try {
          const { supplier, phone, customerCode, captchaCode } = data
          const supplierID = supplier.supplier_id
          const response = await billAPI.getBillInfo({
            appID: AppID.TELEVISION,
            supplierID,
            customerCode,
            captcha: captcha!,
            captchaCode,
          })
          updateBillInfo(response)
          updateSupplier(supplier!)
          setIsLoading(false)
          let url = `/truyen-hinh/chi-tiet-hoa-don?supplierid=${supplierID}&customercode=${b64EncodeUnicode(
            customerCode
          )}`
          if (!!phone) {
            url += `&phonenumber=${phone}`
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

  const selectedSupplier = methods.getValues('supplier')
  const billDemo = getBillDemo(
    (selectedSupplier.query_types && selectedSupplier.query_types[0].sample_bill_link) || '',
    Number(selectedSupplier.ID)
  )

  return (
    <div>
      <div className="mb-3 text-xl font-bold md:mb-6 md:text-heading-lg">
        Nhập thông tin hoá đơn
      </div>

      <FormProvider {...methods}>
        <SupplierSelect supplierGroups={supplierGroups} isMobile={isMobile} />

        <CustomerInput />

        <CaptchaInput
          productID={ProductID.TELEVISION}
          appID={AppID.TELEVISION}
          captcha={captcha}
          onCaptchaChange={setCaptcha}
        />

        {!!billDemo && (
          <div className="w-full">
            <p className="mb-3 text-base font-medium text-dark-300">Hoá đơn mẫu</p>
            <div className="flex max-h-full max-w-full items-center justify-center">
              <Image
                className="w-full md:h-[206.48px] md:w-[267px]"
                src={billDemo}
                alt="thanh-toan-cuoc-truyen-hinh-online"
                width={0}
                height={0}
                loader={({ src }) => src}
              />
            </div>
          </div>
        )}

        <SubmitButton text="Tiếp tục" onClick={handleBillInfoQuery} />
      </FormProvider>
    </div>
  )
}
