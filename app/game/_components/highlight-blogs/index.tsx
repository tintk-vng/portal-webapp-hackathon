import blogAPI from '@/api-client/common/blog'
import Image from '@/components/common/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const LIMIT = 3

interface HighlightBlogsProps {
  subCategoryID: number | undefined
}

export default function HighlightBlogs({ subCategoryID }: HighlightBlogsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{
    blogs: Blog[]
    hasMore: boolean
  } | null>(null)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        if (subCategoryID === undefined) {
          throw new Error('Failed to fetch blogs: Missing subCategoryID')
        }
        const blogs = await blogAPI.getBlogsBySubCategoryID({
          subCategoryID,
          limit: LIMIT + 1,
          offset: 0,
        })
        setData({
          blogs: blogs.slice(0, LIMIT),
          hasMore: blogs.length > LIMIT,
        })
      } catch (error) {
        console.error('Failed to get blogs:', error)
        setData({ blogs: [], hasMore: false })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (isLoading || !data || data.blogs?.length === 0) {
    return null
  }

  return (
    <>
      <div className="mb-3 text-heading-md md:mb-4 md:text-heading-lg">Tin tức</div>

      <div className="no-scrollbar mx-[-16px] flex gap-4 overflow-y-scroll px-4 md:mx-0 md:gap-6 md:px-0">
        {data.blogs.map((blog) => {
          const thumbnailUrl = blog.thumbnail?.url || blog.avatar

          return (
            <Link
              key={blog.ID}
              className="w-[calc(75vw-48px)] min-w-[calc(75vw-48px)] cursor-pointer md:w-1/3 md:min-w-0"
              href={`/tin-tuc?slug=${blog.slug}-${blog.ID}`}
            >
              <div className="relative aspect-[2/1] h-auto w-full overflow-hidden rounded-lg">
                {thumbnailUrl && (
                  <Image
                    className="object-cover"
                    src={thumbnailUrl}
                    alt={blog.title}
                    fill
                    loader={({ src }) => src}
                  />
                )}
              </div>

              <div className="mt-4 line-clamp-2 font-bold">{blog.title}</div>

              <div className="mt-2 line-clamp-2 text-sm text-dark-300">{blog.description}</div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
