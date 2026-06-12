'use client'

import blogAPI from '@/api-client/common/blog'
import ErrorBoundary from '@/components/layout/error-boundary'
import commonUtil from '@/utils/common'
import { useEffect, useState } from 'react'
import Breadcrumb from '../_components/breadcrumb'
import BlogContent from './_components/blog-content'
import EmptyState from './_components/empty-state'
import LoadingState from './_components/loading-state'

const extractBlogID = (slug: string): number | null => {
  const match = slug.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const slug = commonUtil.getParameterByName('slug')
        if (!slug) {
          throw new Error('Failed to fetch blog: Missing slug')
        }

        const blogID = extractBlogID(slug)
        if (!blogID) {
          throw new Error('Failed to fetch blog: Missing blog ID')
        }

        const data = await blogAPI.getBlogByID(blogID)
        setBlog(data)
      } catch (error) {
        console.error('Failed to fetch blog:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [])

  if (isLoading) {
    return <LoadingState />
  }

  if (!blog) {
    return <EmptyState />
  }

  return (
    <ErrorBoundary>
      <Breadcrumb />

      <BlogContent blog={blog} />
    </ErrorBoundary>
  )
}
