import StaticImage from '@/components/common/static-image'
import { AppID } from '@/constants/telco'
import { Supplier } from '@/types/telco'

const LOGO_ALT_BY_APP_ID: { [key: string]: string } = {
  [AppID.PHONE_CARD]:
    'mua-the-cao-dien-thoai-viettel-mobiphone-vinaphone-Gmobile-vietnammobile-chiet-khau-cao',
  [AppID.TOPUP]:
    'nap-tien-dien-thoai-viettel-mobiphone-vinaphone-Gmobile-vietnammobile-chiet-khau-cao',
  [AppID.POST_PAID]: 'tra-cuu-thanh-toan-cuoc-phi-dien-thoai-tra-sau-viettel-mobiphone-vinaphone',
  [AppID.DATA_TOPUP]: 'nap-data-3G-4G-viettel-mobiphone-vinaphone-chiet-khau-cao',
  [AppID.DATA_CODE]: 'mua-the-cao-data-3G-4G-viettel-mobiphone-chiet-khau-cao',
  [AppID.COMBO]: 'nap-combo-data-nghe-goi-online-chiet-khau-cao',
}

interface PartnersProps {
  appID: AppID
  suppliers: Supplier[]
}

export default function Partners({ appID, suppliers }: PartnersProps) {
  return (
    <div>
      <div className="mb-3 text-heading-sm font-bold @4xl:hidden md:mb-4 md:text-xl">
        Đối tác Zalopay
      </div>

      <ul className="grid grid-cols-3 gap-3 md:grid-cols-5 lg:flex lg:gap-0 lg:space-x-3">
        {suppliers.map((suppliers) => (
          <li key={suppliers.telcoCode} className="relative h-[45px] lg:w-[124px]">
            <StaticImage
              className="rounded-lg bg-other-background"
              src={suppliers.logo || ''}
              fill
              alt={LOGO_ALT_BY_APP_ID[appID]}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
