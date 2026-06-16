'use client'

import StaticImage from '@/components/common/static-image'
import dayjs from 'dayjs'
import './article-header.scss'

interface ArticleHeaderProps {
  blog: Blog
}

export default function ArticleHeader({ blog }: ArticleHeaderProps) {
  const publishDate = blog.publishTimer || blog.publishedAt || blog.createdAt
  const thumbnailUrl = blog.thumbnail?.url || blog.avatar

  return (
    <section className="article-header bg-white-500 rounded-lg shadow-md p-6 md:p-8 mb-6">
      {thumbnailUrl && (
        <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-lg">
          <StaticImage
            className="object-cover"
            src={thumbnailUrl}
            alt={blog.thumbnail?.name || blog.title}
            fill
            loader={({ src }) => src}
          />
        </div>
      )}
      <h1 className="text-heading-lg md:text-[28px] md:leading-9 font-extrabold text-dark-500 mb-2">
        {blog.title}
      </h1>
      {blog.subtitle && (
        <p className="text-label-lg md:text-label-xl text-dark-400 mb-3">
          {blog.subtitle}
        </p>
      )}
      <div className="flex items-center text-label-sm text-dark-300 mb-4">
        <StaticImage
          src="https://scdn.zalopay.com.vn/zst/zpi/images/design-system/icons/Second/general_calendar.svg"
          width={16}
          height={16}
          alt="calendar-icon"
        />
        <span className="ml-1">{dayjs(publishDate).format('HH:mm - DD/MM/YYYY')}</span>
      </div>
      {blog.author && (
        <div className="text-label-md text-dark-500 font-semibold">{blog.author}</div>
      )}
    </section>
  )
}
