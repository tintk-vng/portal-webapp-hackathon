import Image from '@/components/common/image'
import { AppID, EVENT } from '@/constants/telco'
import useToggle from '@/hooks/use-toggle'
import { DataSupplier, PostPaidSupplier, TopupSupplier } from '@/types/telco'
import commonUtil from '@/utils/common'
import telcoUtil from '@/utils/telco'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const SupplierDropDownMenu = dynamic(() => import('./supplier-dropdown-menu'))

interface SupplierDropDownProps {
  appID: AppID
  suppliers: Array<TopupSupplier | DataSupplier | PostPaidSupplier>
  selectedSupplier: TopupSupplier | DataSupplier | PostPaidSupplier
  onSupplierChange: Function
}

export default function SupplierDropDown({
  appID,
  suppliers,
  selectedSupplier,
  onSupplierChange,
}: SupplierDropDownProps) {
  const [visible, toggle] = useToggle()
  const supplierLogo = telcoUtil.getSupplierLogoByTelcoCode(selectedSupplier.telcoCode)

  useEffect(() => {
    if (visible) {
      commonUtil.trackEvent({ ID: EVENT[appID].SHOW_SUPPLIER_DROPDOWN_MENU })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <>
      <button
        className="flex h-full w-[153px] items-center justify-between space-x-4 px-4 py-2.5 lg:w-[132px]"
        onClick={toggle}
      >
        <div className="relative h-full w-full">
          {supplierLogo && (
            <Image src={supplierLogo} fill style={{ objectFit: 'contain' }} alt="supplier-logo" />
          )}
        </div>

        <span className='h-6 w-6 min-w-6 bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons/down.svg")] bg-contain bg-no-repeat' />
      </button>

      <SupplierDropDownMenu
        appID={appID}
        suppliers={suppliers}
        selectedSupplier={selectedSupplier}
        onSupplierChange={onSupplierChange}
        visible={visible}
        onClose={toggle}
      />
    </>
  )
}
