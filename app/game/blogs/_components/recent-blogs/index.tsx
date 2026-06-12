'use client'

import blogAPI from '@/api-client/common/blog'
import Button, { ButtonSize, ButtonType } from '@/components/common/button'
import { useEffect, useState } from 'react'
import BlogCard from '../blog-card'
import LoadingState from '../loading-state'

const LIMIT = 10

interface RecentBlogsProps {
  subCategoryID: number
}

export default function RecentBlogs({ subCategoryID }: RecentBlogsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [bufferCount, setBufferCount] = useState(0)

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
        setDisplayedBlogs(blogs.slice(0, LIMIT))
        setHasMore(blogs.length > LIMIT)
      } catch (error) {
        console.error('Failed to get blogs:', error)
        setDisplayedBlogs([])
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (isLoading) {
    return <LoadingState />
  }

  const handleLoadMoreSuccess = (data: Blog[]) => {
    const blogsToAdd = data.slice(0, LIMIT)
    setDisplayedBlogs((prev) => [...prev, ...blogsToAdd])
    setHasMore(data.length > LIMIT)
    setIsLoadingMore(false)
  }

  const handleLoadMoreFail = () => {
    setBufferCount((prev) => prev + 1)
    setIsLoadingMore(false)
  }

  const handleLoadMore = async () => {
    try {
      if (isLoadingMore || !hasMore) {
        return
      }

      setIsLoadingMore(true)
      const blogs = await blogAPI.getBlogsBySubCategoryID({
        subCategoryID,
        limit: LIMIT + 1,
        offset: displayedBlogs.length + bufferCount,
      })
      handleLoadMoreSuccess(blogs)
    } catch (error) {
      console.error('Failed to load more blogs:', error)
      handleLoadMoreFail()
    }
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedBlogs.map((blog) => (
          <BlogCard key={blog.ID} blog={blog} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            type={ButtonType.TEXT_LINK}
            isDisabled={isLoadingMore}
            size={ButtonSize.LARGE}
            onClick={handleLoadMore}
          >
            {isLoadingMore ? 'Đang tải...' : 'Xem thêm'}
          </Button>

          {/* <button
          type="button"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="rounded-lg bg-blue-500 px-8 py-3 font-medium text-white-500 transition-colors hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoadingMore ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner />
              Đang tải...
            </span>
          ) : (
            'Xem thêm'
          )}
        </button> */}
        </div>
      )}
    </>
  )
}
