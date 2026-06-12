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

export default function DataCode() {
  return (
    <Layout
      sideContent={
        <>
          <div className="mb-6">
            <Partners appID={AppID.DATA_CODE} suppliers={suppliers} />
          </div>

          <PaymentGuide
            title="Cách mua thẻ Data 4G/5G nhanh chóng"
            descriptions={[
              'Bước 1: Chọn nhà mạng cần mua thẻ Data',
              'Bước 2: Bấm chọn “<b>gói data</b>” cần nạp, chọn gói <b>Gói tốt dành riêng cho bạn</b> nếu có ',
              'Bước 3: Chọn số lượng cần nạp, tối đa được mua 5 thẻ cùng lúc',
              'Bước 4: Nhập địa chỉ email của bạn, chúng tôi gửi kết quả thanh toán qua email bạn cung cấp',
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
