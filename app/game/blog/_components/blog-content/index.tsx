'use client'

import StaticImage from '@/components/common/static-image'
import { ParagraphType } from '@/constants/game'
import commonUtil from '@/utils/common'
import dayjs from 'dayjs'
import './styles.scss'
interface BlogContentProps {
  blog: Blog
}

export default function BlogContent({ blog }: BlogContentProps) {
  const publishDate = blog.publishTimer || blog.publishedAt || blog.createdAt
  const thumbnailUrl = blog.thumbnail?.url || blog.avatar

  return (
    <div>
      {thumbnailUrl && (
        <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
          <StaticImage
            className="object-cover"
            src={thumbnailUrl}
            alt={blog.thumbnail?.name || blog.title}
            fill
            loader={({ src }) => src}
          />
        </div>
      )}

      <div className="mb-3 text-heading-lg md:mb-4">{blog.title}</div>

      {publishDate && (
        <div className="mb-3 flex items-center gap-2 md:mb-4">
          <StaticImage
            src="https://scdn.zalopay.com.vn/zst/zpi/images/design-system/icons/Second/general_calendar.svg"
            width={16}
            height={16}
            alt="calendar-icon"
          />

          <span className="text-label-sm">{dayjs(publishDate).format('HH:mm - DD/MM/YYYY')}</span>
        </div>
      )}

      {blog.description && (
        <p className="mb-3 text-label-lg font-bold md:mb-4">{blog.description}</p>
      )}

      {blog.content && (
        <div
          className="blog-content prose prose-lg mb-3 max-w-none text-dark-500 md:mb-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      )}

      {!commonUtil.isEmpty(blog.paragraphs) &&
        blog.paragraphs!.map((item, index) => {
          if (!item) {
            return null
          }

          if (item.type === ParagraphType.RawHTMLString) {
            return <div key={index} dangerouslySetInnerHTML={{ __html: item.content || '' }} />
          }

          // if (item.type === ParagraphType.PaymentService) {
          //   return <PaymentService data={item.data as any} loading={false} className={styles.paymentService} />
          // }

          // const { ctaData } = item
          // return ctaData && <SimpleCTA key={index} {...ctaData} pos={simpleCTACounter++} />

          return null
        })}

      {blog.author && (
        <div className="mb-3 flex w-full items-center justify-end text-label-lg font-bold md:mb-4">
          {blog.author}
        </div>
      )}

      {!commonUtil.isEmpty(blog.tags) && (
        <div className="flex flex-wrap items-center gap-1 text-label-md">
          <div className="text-dark-200">Tags:</div>

          <div className="flex flex-wrap items-center gap-2">
            {blog.tags.map((tag) => (
              <span key={tag.ID}>#{tag.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
