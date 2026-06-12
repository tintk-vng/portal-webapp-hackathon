'use client'

import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import NextImage, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

const PLACEHOLDER_IMAGE_URL =
  'https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/placeholder11.svg'

export default function Image({
  src,
  alt,
  className = '',
  width,
  height,
  fill,
  style,
  priority,
  loader,
}: ImageProps) {
  useEffect(() => {
    setImageSrc(src || PLACEHOLDER_IMAGE_URL)
  }, [src])

  const [imageSrc, setImageSrc] = useState<string | StaticImport>(src || PLACEHOLDER_IMAGE_URL)

  const handleError = () => {
    setImageSrc(PLACEHOLDER_IMAGE_URL)
  }

  return (
    <NextImage
      className={className}
      src={imageSrc}
      width={width}
      height={height}
      fill={fill}
      // {...(fill ? { sizes: '100vw' } : {})}
      sizes="100vw"
      style={style}
      {...(priority ? { priority } : { loading: 'lazy' })}
      {...(loader
        ? {
            loader: ({ src, width, quality }) => {
              return (src || PLACEHOLDER_IMAGE_URL) + '?w=' + width
            },
          }
        : {})}
      alt={alt}
      onError={handleError}
    />
  )
}
