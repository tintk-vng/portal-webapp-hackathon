'use client'

import Image from '@/components/common/image'
import StaticImage from '@/components/common/static-image'
import dayjs from 'dayjs'
import Link from 'next/link'

interface BlogCardProps {
  blog: Blog
}

export default function BlogCard({ blog }: BlogCardProps) {
  const publishDate = blog.publishTimer || blog.publishedAt || blog.createdAt
  const thumbnailUrl = blog.thumbnail?.url || blog.avatar

  return (
    <Link
      href={`/mua-the-game/tin-tuc?slug=${blog.slug}-${blog.ID}`}
      className="block overflow-hidden rounded-xl bg-white-500"
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl">
        <Image
          className="object-cover"
          src={thumbnailUrl}
          alt={blog.thumbnail?.name || blog.title}
          fill
          loader={({ src }) => src}
        />
      </div>

      <div className="py-4">
        {publishDate && (
          <div className="mb-2 flex items-center gap-2">
            <StaticImage
              src="https://scdn.zalopay.com.vn/zst/zpi/images/design-system/icons/Second/general_calendar.svg"
              width={16}
              height={16}
              alt="calendar-icon"
            />

            <span className="text-label-sm text-dark-300">
              {dayjs(publishDate).format('HH:mm - DD/MM/YYYY')}
            </span>
          </div>
        )}

        <div className="mb-2 line-clamp-2 text-label-lg font-bold">{blog.title}</div>

        {blog.description && (
          <p className="line-clamp-2 text-label-md text-dark-300">{blog.description}</p>
        )}
      </div>
    </Link>
  )
}
