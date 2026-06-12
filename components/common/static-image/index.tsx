'use client'

import NextImage, { ImageProps } from 'next/image'

const PLACEHOLDER_IMAGE_URL =
  'https://simg.zalopay.com.vn/zst/zpi/images/design-system/placeholder11.svg'

export default function StaticImage({
  src,
  alt,
  className = '',
  width,
  height,
  fill,
  style,
  loader,
  onClick,
}: ImageProps) {
  return (
    <NextImage
      className={className}
      src={src || PLACEHOLDER_IMAGE_URL}
      width={width}
      height={height}
      fill={fill}
      style={style}
      priority
      {...(loader
        ? {
            loader: ({ src, width, quality }) => {
              return (src || PLACEHOLDER_IMAGE_URL) + '?w=' + width
            },
          }
        : {})}
      alt={alt}
      onClick={onClick}
    />
  )
}
