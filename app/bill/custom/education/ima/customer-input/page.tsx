'use client'

import billAPI from '@/api-client/bill'
import { DialogState } from '@/components/common/dialog'
import { API_PATH, AppID, THEME_COLOR } from '@/constants/bill'
import useCustomSWR from '@/hooks/use-custom-swr'
import billModel from '@/models/bill'
import eduModel from '@/models/bill/education'
import { useEducationStore } from '@/store/bill'
import { IError, QueryType } from '@/types/bill'
import { Department } from '@/types/bill/education'
import { Supplier } from '@/types/bill/water'
import { Captcha } from '@/types/common'
import { b64EncodeUnicode } from '@/utils/bill'
import commonUtil from '@/utils/common'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import Loading from '../loading'
import QueryInput from './components/query-input'
import SupplierSelect from './components/supplier-select'
import State, {
  mapStateViewByCodeAndReason,
  mapTitleByCodeAndReason,
} from '@/app/bill/components/state'
import SubmitButton from '../../../components/submit-button'

type FormValues = {
  supplier: Supplier | undefined
  department: Department | undefined
  customerCode: string
  className: string
  schoolName: string
  captchaCode: string
}

export default function CustomerInput() {
  const router = useRouter()
  const updateBillInfo = useEducationStore((state) => state.updateBillInfo)
  const updateSupplier = useEducationStore((state) => state.updateSupplier)
  const searchParams = useSearchParams()
  const studentCode = searchParams?.get('student_code') || ''
  const campusCode = searchParams?.get('campus_code') || ''
  const methods = useForm<FormValues>({
    defaultValues: {
      supplier: undefined,
      department: undefined,
      customerCode: studentCode,
      className: '',
      schoolName: '',
      captchaCode: '',
    } as FormValues,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [captcha, setCaptcha] = useState<Captcha | undefined>(undefined)
  const [selectedQueryType, setSelectedQueryType] = useState<QueryType | undefined>(undefined)
  const [billInfoError, setBillInfoError] = useState<IError | undefined>(undefined)
  const {
    data,
    error,
    isLoading: areSuppliersLoading,
  } = useCustomSWR(API_PATH[AppID.EDUCATION].GET_SUPPLIERS, () =>
    billAPI.getSuppliers({ appID: AppID.EDUCATION })
  )
  const modeledSuppliers = useMemo(() => eduModel.modelSuppliers(data), [data])

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
    const deeplink = `https://onelink.zalopay.vn/hoc-phi?view=detail&customercode=${customerCode}&supplierid=${supplier?.ID}&appid=${AppID.EDUCATION}&act=open_cashier&from_source=webside_dgs`
    return (
      <State
        type={type}
        extraInfo={{
          appID: AppID.EDUCATION,
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

  const { getValues, setValue, setError, handleSubmit } = methods

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
            appID: AppID.EDUCATION,
            supplierID,
            customerCode,
            departmentCode: campusCode,
            captcha: captcha!,
            captchaCode,
          })
          updateBillInfo(response)
          updateSupplier(selectedSupplier!)
          setIsLoading(false)
          let url = `/hoc-phi/ima/chi-tiet-hoa-don/${b64EncodeUnicode(
            data.customerCode
          )}?supplierid=${supplierID}&iframe=true&student_code=${studentCode}`
          const encrypt = searchParams?.get('encrypt') || ''
          const voucherToken = searchParams?.get('voucherToken') || ''
          if (encrypt) {
            url += `&encrypt=${encrypt}`
          }
          if (campusCode) {
            url += `&campus_code=${campusCode}`
          }
          if (voucherToken) {
            url += `&voucherToken=${voucherToken}`
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

  const onSetDefault = (supplier: Supplier) => {
    setValue('supplier', supplier)
  }

  return (
    <div>
      <div className="rounded-2xl bg-white px-[64px] py-[32px] shadow-[0_0px_2px_0_rgba(0,0,0,0.1),_0_1px_5px_0_rgba(0,0,0,0.1)]">
        <div className="mb-3 text-2xl font-bold md:mb-6 md:text-heading-lg">
          Nhập thông tin hoá đơn
        </div>

        <FormProvider {...methods}>
          {!commonUtil.isEmpty(modeledSuppliers) && (
            <SupplierSelect
              onSetDefault={onSetDefault}
              suppliers={modeledSuppliers}
              onSelectedQueryTypeChange={setSelectedQueryType}
            />
          )}

          {selectedQueryType && (
            <>
              <QueryInput
                disable={studentCode.length > 0}
                selectedQueryType={selectedQueryType}
                captcha={captcha}
                onCaptchaChange={setCaptcha}
              />
            </>
          )}

          <SubmitButton
            themeColor={THEME_COLOR.IMA}
            text="Tiếp tục"
            onClick={handleBillInfoQuery}
          />
        </FormProvider>
      </div>
    </div>
  )
}
