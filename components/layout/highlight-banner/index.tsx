'use client'

import StaticImage from '@/components/common/static-image'
import useIframe from '@/hooks/use-iframe'
import { Banner } from '@/types/common'
import commonUtil from '@/utils/common'
import Link from 'next/link'
import 'swiper/css'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './styles.module.scss'

interface HighlightBannerProps {
  banners: Banner[]
}

export default function HighlightBanner({ banners }: HighlightBannerProps) {
  const isInIframe = useIframe()

  if (isInIframe || commonUtil.isEmpty(banners)) {
    return null
  }

  const hasMoreBanners = banners.length > 1
  const pagination = {
    enabled: true,
    clickableClass: styles.paginationBullets,
    bulletClass: styles.paginationBullet,
    bulletActiveClass: styles.paginationBulletActive,
    clickable: true,
    renderBullet: (index: number, className: string) => {
      return '<span class="' + className + '"></span>'
    },
  }

  return (
    <div className="relative mb-4 md:mb-10">
      <Swiper
        slidesPerView="auto"
        pagination={hasMoreBanners ? pagination : false}
        modules={hasMoreBanners ? [Autoplay, Pagination] : [Pagination]}
        className="!static w-full !px-4 md:!px-0"
        loop={hasMoreBanners}
        autoplay={{
          delay: 5000,
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide
            key={banner.ID}
            className="mr-4 w-full bg-other-background pb-[calc(100%*1/4)] last:mr-0"
          >
            {banner.url ? (
              <Link
                className="block h-full w-full"
                href={banner.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <StaticImage
                  className="z-10 cursor-pointer rounded-lg object-cover"
                  src={banner.src}
                  fill
                  alt="banner"
                  loader={({ src }) => src}
                />
              </Link>
            ) : (
              <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAAAgCAMAAAArFdbrAAAAPFBMVEUAAADN4f/P4//M4f/M4v/N4P/L3//P3//M4f/N4f/L4f/K4f/M4f/L4//M4f/M4v/M4P/N4v/N4f/M4f/YP8qzAAAAE3RSTlMA3yCAv2BAEO+fcDDPQJCvUI+PnNWK/gAAAnhJREFUSMetltma6yAIgEUxrlla3/9dz1RwG9PvJNNylVDCDwhU8ZEcEe5IVJ/hZLor/pLfIM/16jYPr+AwJfVFnuzFzF71y9B8iydx1Ozm1Kt8wwO/kHhnr/DmGP0tnu66Z7vCm4y2O7xR76/UE36plr/zxHalXxZNQsZO3OatiOjCS2Hs5XngREHe5+lWF3edF7tqGoUAuxby+ZTMq+ro1lMelhMEFeTiIaH6ocOxUAz0hGMWPNeay/KAHzNTeb5Uy8kTHvCsblwulfFLzeR4PRGvfrPTFh77h3jDdIN5l9+4iUwKZMbhYOFJ2w5PwilPD1th5h35/FAMkvGmVE6WehpCSFHP3CrtYeDlN9TakbbjHYi408FDyBE/nWaezWmx70fhPfrNAgUtbcdba1Hy+3Y6fwpKsbiuFJjnagPzfL9YQpvCreOp1r0vd/GMp5NrQ2GIhzSWOv9MPNn3gMiJaP6+8bITsthf1jPPKM4KUnXBXAdcVqz9YaW4w7Mdz6w/op+1itD6h1WL47SQPmdCq6ea6pmfQz3gOPVnOxNM1bZEJrnMOA563YHWUOKNl50+atb7xGtDuLSJ6f8AIP8eEvGKaAovrnKN/TzQKlZB0pbRM691iY6wmcrDbqMgee8Fl3Q676pXgnjDe4hBWgwiEg/SbzHqlNdHZuXEq+YzT1FbTPmxtE1Jk79wPmav2QXBPB7nTmwBBu517hj35r5k/StizCvNHBEOIVREAmjMNGVE5UU53RBcJu3JhxVIUWacp3+6EJJSnAkbMI+KMIkF216GmqP4RNT1OzV8g+cv8RY+yM958hKPdwtvsY/kQPi/HEIYfvTiH2cYdmbzycI3AAAAAElFTkSuQmCC')] bg-center bg-no-repeat">
                <StaticImage
                  className="z-10 rounded-lg object-cover"
                  src={banner.src}
                  fill
                  alt="banner"
                  loader={({ src }) => src}
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
