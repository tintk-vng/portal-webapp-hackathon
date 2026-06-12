import Partners from '@/app/telco/_components/partners'
import PaymentGuide from '@/app/telco/_components/payment-guide'
import { AppID, SupplierStatus, TelcoCode } from '@/constants/telco'
import { Supplier } from '@/types/telco'
import Layout from '../_components/layout'
import Main from './_components/main'

const suppliers: Supplier[] = [
  {
    telcoCode: TelcoCode.VIETTEL,
    status: SupplierStatus.ACTIVE,
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos/viettel.svg',
  },
  {
    telcoCode: TelcoCode.MOBIFONE,
    status: SupplierStatus.ACTIVE,
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos/mobifone.svg',
  },
  {
    telcoCode: TelcoCode.VINAPHONE,
    status: SupplierStatus.ACTIVE,
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos/vinaphone.svg',
  },
  {
    telcoCode: TelcoCode.GMOBILE,
    status: SupplierStatus.ACTIVE,
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos/gmobile.svg',
  },
  {
    telcoCode: TelcoCode.VIETNAMOBILE,
    status: SupplierStatus.ACTIVE,
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos/vietnamobile.svg',
  },
  {
    telcoCode: TelcoCode.WINTEL,
    status: SupplierStatus.ACTIVE,
    logo: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos/wintel.svg',
  },
]

export default function PhoneCard() {
  return (
    <Layout
      sideContent={
        <>
          <div className="mb-6">
            <Partners appID={AppID.PHONE_CARD} suppliers={suppliers} />
          </div>

          <PaymentGuide
            title="Cách mua thẻ điện thoại trên website Zalopay"
            descriptions={[
              'Bước 1: Chọn nhà cung cấp',
              'Bước 2: Bấm chọn “<b>mệnh giá nạp</b>”, chọn gói Flash Sale (khuyến mãi) nếu có ',
              'Bước 3: Chọn số lượng thẻ (được phép mua tối đa 5 thẻ mỗi lần)',
              'Bước 4: Nhập địa chỉ email để Zalopay gửi thông tin thẻ',
              'Bước 5: Bấm chọn “<b>Mua ngay</b>” để thanh toán và hoàn tất giao dịch',
            ]}
          />
        </>
      }
    >
      <Main />
    </Layout>
  )
}
