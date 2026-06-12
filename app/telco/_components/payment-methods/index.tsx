// import Image from '@/components/common/image'
// import ABLogo from '@/public/images/logos/banks/ab.svg'
// import ACBLogo from '@/public/images/logos/banks/acb.svg'
// import AgriLogo from '@/public/images/logos/banks/agri.svg'
// import BacALogo from '@/public/images/logos/banks/baca.svg'
// import BanVietLogo from '@/public/images/logos/banks/banviet.svg'
// import BaoVietLogo from '@/public/images/logos/banks/baoviet.svg'
// import BIDVLogo from '@/public/images/logos/banks/bidv.svg'
// import CakeLogo from '@/public/images/logos/banks/cake.svg'
// import EximLogo from '@/public/images/logos/banks/exim.svg'
// import HDLogo from '@/public/images/logos/banks/hd.svg'
// import KasikornLogo from '@/public/images/logos/banks/kasikorn.svg'
// import KienLongLogo from '@/public/images/logos/banks/kienlong.svg'
// import LienVietPostLogo from '@/public/images/logos/banks/lienvietpost.svg'
// import MBLogo from '@/public/images/logos/banks/mb.svg'
// import MSBLogo from '@/public/images/logos/banks/msb.svg'
// import NamALogo from '@/public/images/logos/banks/nama.svg'
// import NCBLogo from '@/public/images/logos/banks/ncb.svg'
// import OCBLogo from '@/public/images/logos/banks/ocb.svg'
// import OceanLogo from '@/public/images/logos/banks/ocean.svg'
// import PGLogo from '@/public/images/logos/banks/pg.svg'
// import PVcomLogo from '@/public/images/logos/banks/pvcom.svg'
// import SacomLogo from '@/public/images/logos/banks/sacom.svg'
// import SaiGonLogo from '@/public/images/logos/banks/saigon.svg'
// import SCBLogo from '@/public/images/logos/banks/scb.svg'
// import SeALogo from '@/public/images/logos/banks/sea.svg'
// import ShinhanLogo from '@/public/images/logos/banks/shinhan.svg'
// import TechcomLogo from '@/public/images/logos/banks/techcom.svg'
// import TPLogo from '@/public/images/logos/banks/tp.svg'
// import ULogo from '@/public/images/logos/banks/u.svg'
// import VIBLogo from '@/public/images/logos/banks/vib.svg'
// import VietLogo from '@/public/images/logos/banks/viet.svg'
// import VietALogo from '@/public/images/logos/banks/vieta.svg'
// import VietinLogo from '@/public/images/logos/banks/vietin.svg'
// import VPLogo from '@/public/images/logos/banks/vp.svg'
// import ZaloLogo from '@/public/images/logos/banks/zalo.svg'
// import JCBLogo from '@/public/images/logos/jcb.svg'
// import MasterCardLogo from '@/public/images/logos/mastercard.svg'
// import VisaLogo from '@/public/images/logos/visa.svg'
// import ZaloPayLogo from '@/public/images/logos/zalopay.svg'

// const PAYMENT_METHOD: {
//   [key: string]: { title: string; suppliers: { ID: string; logo: string }[] }
// } = {
//   INTERNATIONAL_CARD: {
//     title: 'Thanh toán bằng thẻ quốc tế',
//     suppliers: [
//       {
//         ID: 'VISA',
//         logo: VisaLogo,
//       },
//       {
//         ID: 'MASTERCARD',
//         logo: MasterCardLogo,
//       },
//       {
//         ID: 'JCB',
//         logo: JCBLogo,
//       },
//     ],
//   },
//   MOBILE_WALLET: {
//     title: 'Ví điện tử Zalopay',
//     suppliers: [
//       {
//         ID: 'ZALOPAY',
//         logo: ZaloPayLogo,
//       },
//     ],
//   },
//   DOMESTIC_CARD: {
//     title: 'Thanh toán bằng thẻ nội địa',
//     suppliers: [
//       {
//         ID: 'ACBBANK',
//         logo: ACBLogo,
//       },
//       {
//         ID: 'TECHCOMBANK',
//         logo: TechcomLogo,
//       },
//       {
//         ID: 'BIDVBANK',
//         logo: BIDVLogo,
//       },
//       {
//         ID: 'AGRIBANK',
//         logo: AgriLogo,
//       },
//       {
//         ID: 'MBBANK',
//         logo: MBLogo,
//       },
//       {
//         ID: 'SAIGONBANK',
//         logo: SaiGonLogo,
//       },
//       {
//         ID: 'VIETINBANK',
//         logo: VietinLogo,
//       },
//       {
//         ID: 'OCEANBANK',
//         logo: OceanLogo,
//       },
//       {
//         ID: 'MSBBANK',
//         logo: MSBLogo,
//       },
//       {
//         ID: 'EXIMBANK',
//         logo: EximLogo,
//       },
//       {
//         ID: 'HDBANK',
//         logo: HDLogo,
//       },
//       {
//         ID: 'BACABANK',
//         logo: BacALogo,
//       },
//       {
//         ID: 'TPBANK',
//         logo: TPLogo,
//       },
//       {
//         ID: 'VIETBANK',
//         logo: VietLogo,
//       },
//       {
//         ID: 'SACOMBANK',
//         logo: SacomLogo,
//       },
//       {
//         ID: 'UBANK',
//         logo: ULogo,
//       },
//       {
//         ID: 'OCBBANK',
//         logo: OCBLogo,
//       },
//       {
//         ID: 'NAMABANK',
//         logo: NamALogo,
//       },
//       {
//         ID: 'NCBBANK',
//         logo: NCBLogo,
//       },
//       {
//         ID: 'VIETABANK',
//         logo: VietALogo,
//       },
//       {
//         ID: 'BANVIETBANK',
//         logo: BanVietLogo,
//       },
//       {
//         ID: 'VIBBANK',
//         logo: VIBLogo,
//       },
//       {
//         ID: 'SEABANK',
//         logo: SeALogo,
//       },
//       {
//         ID: 'VPBANK',
//         logo: VPLogo,
//       },
//       {
//         ID: 'SHINHANBANK',
//         logo: ShinhanLogo,
//       },
//       {
//         ID: 'KIENLONGBANK',
//         logo: KienLongLogo,
//       },
//       {
//         ID: 'LIENVIETBANK',
//         logo: LienVietPostLogo,
//       },
//       {
//         ID: 'KASIKORNBANK',
//         logo: KasikornLogo,
//       },
//       {
//         ID: 'PVCOMBANK',
//         logo: PVcomLogo,
//       },
//       {
//         ID: 'CAKEBANK',
//         logo: CakeLogo,
//       },
//       {
//         ID: 'SCBBANK',
//         logo: SCBLogo,
//       },
//       {
//         ID: 'PGBANK',
//         logo: PGLogo,
//       },
//       {
//         ID: 'ZALO',
//         logo: ZaloLogo,
//       },
//       {
//         ID: 'BAOVIETBANK',
//         logo: BaoVietLogo,
//       },
//       {
//         ID: 'ABBANK',
//         logo: ABLogo,
//       },
//     ],
//   },
// }

export default function PaymentMethods() {
  return (
    <div>
      {/* <div className="mb-3 text-heading-sm md:mb-4 md:text-xl">
        Cung cấp các hình thức thanh toán sau
      </div>

      <div className="rounded-lg p-4 shadow-[0px_2px_12px_rgba(0,31,62,0.05)] md:flex">
        <div className="border-b border-dark-50 pb-4 md:border-b-0 md:border-r md:pr-6">
          <div className="mb-6">
            <p className="mb-3 text-paragraph-lg">{PAYMENT_METHOD.INTERNATIONAL_CARD.title}</p>

            <ul className="flex space-x-3 md:space-x-4">
              {PAYMENT_METHOD.INTERNATIONAL_CARD.suppliers.map((supplier) => (
                <li key={supplier.ID}>
                  <Image src={supplier.logo} alt={`${supplier.ID}-logo`} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-paragraph-lg">{PAYMENT_METHOD.MOBILE_WALLET.title}</p>

            <ul className="flex space-x-3 md:space-x-4">
              {PAYMENT_METHOD.MOBILE_WALLET.suppliers.map((supplier) => (
                <li key={supplier.ID}>
                  <Image src={supplier.logo} alt={`${supplier.ID}-logo`} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-4 md:pl-6 md:pt-0">
          <p className="mb-3 text-paragraph-lg">{PAYMENT_METHOD.DOMESTIC_CARD.title}</p>

          <ul className="grid grid-cols-4 gap-2 md:grid-cols-8 md:gap-3">
            {PAYMENT_METHOD.DOMESTIC_CARD.suppliers.map((supplier) => (
              <li key={supplier.ID}>
                <Image src={supplier.logo} alt={`${supplier.ID}-logo`} />
              </li>
            ))}
          </ul>
        </div>
      </div> */}
    </div>
  )
}
