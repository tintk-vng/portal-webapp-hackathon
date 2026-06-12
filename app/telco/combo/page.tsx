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
]

export default function Combo() {
  return (
    <Layout
      sideContent={
        <>
          <div className="mb-6">
            <Partners appID={AppID.COMBO} suppliers={suppliers} />
          </div>

          <PaymentGuide
            title="Hướng dẫn nạp combo trên website Zalopay"
            descriptions={[
              'Bước 1: Nhập số điện thoại cần nạp',
              'Bước 2: Bấm chọn “<b>mệnh giá nạp</b>”, chọn gói Flash Sale (khuyến mãi) nếu có',
              'Bước 3: Nhập địa chỉ email của bạn, chúng tôi gửi kết quả thanh toán qua email bạn cung cấp',
              'Bước 4: Bấm chọn “<b>Nạp ngay</b>” để thanh toán và hoàn tất giao dịch',
            ]}
          />
        </>
      }
    >
      <Main />
    </Layout>
  )
}
