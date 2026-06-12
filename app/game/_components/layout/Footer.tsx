'use client'

import StaticImage from '@/components/common/static-image'
import useIframe from '@/hooks/use-iframe'

export default function Footer() {
  const isInIframe = useIframe()

  if (isInIframe) {
    return <div className="h-[128px] md:hidden" />
  }

  return (
    <div className="m-auto px-4 pb-6 md:max-w-6xl md:px-6 md:pb-10">
      <div className="md:grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-3 md:flex md:items-start md:space-x-6">
          <StaticImage
            className="mb-4 md:mb-0"
            src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos/zion.svg"
            width={0}
            height={0}
            style={{ width: '100%', maxWidth: '120px', height: 'auto' }}
            alt="zion-logo"
          />

          <div className="mb-6 md:mb-0">
            <p className="mb-2 text-paragraph-lg md:mb-3">Công ty Cổ phần ZION</p>

            <div className="mb-1 text-label-md text-dark-300 md:mb-2">
              Địa chỉ: Z06 Đường số 13, Phường Tân Thuận Đông, Quận 7, Tp. Hồ Chí Minh, Việt Nam.
            </div>

            <div className="mb-2 text-label-md text-dark-300">
              Giấy chứng nhận đăng ký kinh doanh số: 0101659783, đăng ký thay đổi lần thứ 30, ngày
              22 tháng 01 năm 2020 do Sở kế hoạch và đầu tư Thành phố Hồ Chí Minh cấp.
            </div>

            <div className="text-label-md text-dark-300">© Copyright Zalopay 2016-2023</div>
          </div>
        </div>

        <div>
          <div className="mb-3 text-heading-sm font-normal text-dark-300 md:mb-4 md:text-paragraph-lg">
            Chứng nhận bởi
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="http://online.gov.vn/Home/AppDetails/879?AspxAutoDetectCookieSupport=1"
              rel="noopener noreferrer"
              target="_blank"
            >
              <StaticImage
                src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos/bocongthuong.svg"
                width={0}
                height={0}
                style={{ width: 'auto', height: '100%', maxHeight: '36px' }}
                alt="bo-cong-thuong-logo"
              />
            </a>

            <StaticImage
              src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos/pcidss.svg"
              width={0}
              height={0}
              style={{ width: 'auto', height: '100%', maxHeight: '36px' }}
              alt="PCI-DSS-logo"
            />
          </div>
        </div>
      </div>

      <div className="h-[128px] md:hidden" />
    </div>
  )
}
