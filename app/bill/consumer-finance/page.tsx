'use client'

import billAPI from '@/api-client/bill'
import CaptchaInput from '@/app/bill/components/captcha-input'
import { DialogState } from '@/components/common/dialog'
import Image from '@/components/common/image'
import { AppID, ProductID, QueryBillTypes } from '@/constants/bill'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import billModel from '@/models/bill'
import consumerFinanceModel from '@/models/bill/consumer-finance'
import { useConsumerFinanceStore } from '@/store/bill'
import { IError, Supplier, QueryType } from '@/types/bill'
import { Captcha } from '@/types/common'
import { b64EncodeUnicode } from '@/utils/bill'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import State, { mapStateViewByCodeAndReason, mapTitleByCodeAndReason } from '../components/state'
import SubmitButton from '../components/submit-button'
import CustomerCodeInput from './components/customer-code-input'
import QueryTypesComponent from './components/query-types'
import Suppliers from './components/suppliers'
import Loading from './loading'
import { getBillDemo } from './logo-mapping'
import useBillSupplier from '@/hooks/use-bill-suppliers'

type FormValues = {
  customerCode: string
  supplier: Supplier
  idNumber: string
  captchaCode: string
}

export default function BillInput() {
  const router = useRouter()
  const updateBillInfo = useConsumerFinanceStore((state) => state.updateBillInfo)
  const updateSupplier = useConsumerFinanceStore((state) => state.updateSupplier)
  const updateContracts = useConsumerFinanceStore((state) => state.updateContracts)
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm') ?? ''
  const methods = useForm<FormValues>({
    defaultValues: {
      customerCode: '',
      supplier: {
        ID: '',
        name: '',
      },
      idNumber: '',
      captchaCode: '',
    } as FormValues,
  })
  const { size } = useScreen()
  const [selectedQueryType, setSelectedQueryType] = useState<QueryType>({} as QueryType)
  const isMobile = size === ScreenSize.MEDIUM || size === ScreenSize.SMALL
  const { getValues, setValue, setError, handleSubmit } = methods
  const selectedSupplier = getValues('supplier')
  const [isLoading, setIsLoading] = useState(false)
  const [captcha, setCaptcha] = useState<Captcha | undefined>(undefined)
  const [billInfoError, setBillInfoError] = useState<IError | undefined>(undefined)
  const {
    modelledData: modeledSuppliers,
    error,
    isLoading: areSuppliersLoading,
  } = useBillSupplier<Supplier[]>(AppID.CONSUMER_FINANCE, consumerFinanceModel.modelSupplierGroups)
  useEffect(() => {
    if (selectedSupplier.ID && selectedSupplier.queryTypes?.[0]) {
      setSelectedQueryType(selectedSupplier.queryTypes[0])
    }
  }, [selectedSupplier])

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
    const deeplink = `https://onelink.zalopay.vn/vay-tieu-dung?view=detail&customercode=${customerCode}&supplierid=${supplier?.ID}&appid=${AppID.CONSUMER_FINANCE}&act=open_cashier&from_source=webside_dgs`
    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.CONSUMER_FINANCE,
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

  const handleBillInfoQuery = (failureCallback: (state: DialogState) => void) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    handleSubmit(
      async (data) => {
        try {
          let supplierID = selectedQueryType?.supplierID ?? Number(data.supplier.ID)
          if (selectedQueryType.type === QueryBillTypes.IDENTITY) {
            const response = await billAPI.getContracts({
              appId: AppID.CONSUMER_FINANCE,
              supplierID,
              identityNumber: data.idNumber,
            })
            updateContracts(response)
            updateSupplier({ ...data.supplier, ID: supplierID.toString() })
            let url = `/vay-tieu-dung/danh-sach-hop-dong?supplierid=${supplierID}&suppliername=${
              data.supplier.name
            }&identity_number=${b64EncodeUnicode(data.idNumber)}&icon=${data.supplier.icon}`
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
            return
          }
          const { customerCode, captchaCode } = data
          const response = await billAPI.getBillInfo({
            appID: AppID.CONSUMER_FINANCE,
            supplierID,
            customerCode,
            captcha: captcha!,
            captchaCode,
          })
          updateBillInfo(response)
          updateSupplier({ ...data.supplier, ID: supplierID.toString() })
          router.push(
            `/vay-tieu-dung/chi-tiet-hoa-don/customercode=${b64EncodeUnicode(
              data.customerCode
            )}?supplierid=${supplierID}`
          )
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

  const onQueryTypeChange = (queryType: QueryType) => {
    setSelectedQueryType(queryType)
  }

  return (
    <div>
      <div className="mb-3 text-xl font-bold md:mb-6 md:text-heading-lg">
        Nhập thông tin hoá đơn
      </div>

      <FormProvider {...methods}>
        <div className="mb-3 w-full md:mb-4">
          <p className="text-base font-bold">Nhà cung cấp</p>
          <Suppliers supplierDatas={modeledSuppliers} isMobile={isMobile} />
        </div>

        {selectedSupplier?.queryTypes && selectedSupplier?.queryTypes.length > 1 && (
          <div className="mb-3 w-full md:mb-4">
            <p className="text-base font-bold">Tra cứu theo</p>
            <div className="mt-3 flex justify-center">
              {selectedSupplier?.queryTypes.map((queryType: QueryType) => {
                return (
                  <div className="w-full px-2 " key={queryType.name + queryType.type}>
                    <QueryTypesComponent
                      queryTypes={queryType}
                      selectedQueryType={selectedQueryType}
                      onChange={onQueryTypeChange}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="w-full">
          <CaptchaInput
            productID={ProductID.CONSUMER_FINANCE}
            appID={AppID.CONSUMER_FINANCE}
            captcha={captcha}
            onCaptchaChange={setCaptcha}
            noCaptcha={selectedQueryType.type === QueryTypeValue.ID_CARD_NUMBER}
          >
            <CustomerCodeInput selectQueryTypes={selectedQueryType} />
          </CaptchaInput>
        </div>

        {selectedQueryType.sampleBillUrl && (
          <div className="w-full">
            <p className="mb-3 text-base font-medium text-dark-300">Hoá đơn mẫu</p>
            <div className="flex max-h-full max-w-full items-center justify-center">
              <Image
                className="w-full object-contain md:h-[206.48px] md:w-[267px]"
                src={getBillDemo(selectedQueryType.sampleBillUrl)}
                alt="thanh-toan-dong-tien-tra-gop-truc-tuyen-an-toan"
                width={0}
                height={0}
                loader={({ src }) => src}
              />
            </div>
          </div>
        )}

        {selectedSupplier?.ID && (
          <label>
            Sản phẩm được cung cấp bởi Công ty {selectedSupplier?.name}. Chi tiết tại{' '}
            <a
              className="text-blue-500"
              href="https://zalopay.vn/danh-sach-nha-cung-cap-doi-tac-dich-vu-thanh-toan-khoan-vay-cua-zalo-pay-3907"
            >
              đây
            </a>
            .<br />
            Bằng việc chọn Tiếp tục, bạn đồng ý với{' '}
            <a
              className="text-blue-500"
              href="https://zalopay.vn/quy-dinh/chinh-sach-bao-ve-quyen-rieng-tu"
            >
              chính sách quyền riêng tư
            </a>{' '}
            và cho phép Zalopay chia sẻ thông tin với nhà cung cấp/đối tác liên quan
          </label>
        )}

        <SubmitButton text="Tiếp tục" onClick={handleBillInfoQuery} />
      </FormProvider>
    </div>
  )
}

enum QueryTypeValue {
  UNKNOWN = 0,
  CUSTOMER_CODE = 1,
  CREDIT_CARD_NUMBER = 2,
  ID_CARD_NUMBER = 3,
  CUSTOMER_CODE_WITH_PHONE = 4,
}
