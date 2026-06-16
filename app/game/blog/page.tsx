'use client'

import blogAPI from '@/api-client/common/blog'
import ErrorBoundary from '@/components/layout/error-boundary'
import commonUtil from '@/utils/common'
import { useEffect, useState } from 'react'
import { getArticleById, NewsArticle } from '@/src/data/newsArticles'
import Breadcrumb from '../_components/breadcrumb'
import BlogContent from './_components/blog-content'
import EmptyState from './_components/empty-state'
import LoadingState from './_components/loading-state'

const extractBlogID = (slug: string): number | null => {
  const match = slug.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

function buildStaticBlog(slug: string, article: NewsArticle): Blog {
  return {
    ID: 0,
    slug,
    title: article.title,
    description: article.summary,
    content: article.content,
    publishedAt: article.publishedAt,
    createdAt: article.publishedAt,
    updatedAt: article.publishedAt,
    publishTimer: article.publishedAt,
    avatar: article.coverImageUrl || '',
    author: 'Ban Biên Tập NapTheVui',
    thumbnail: {
      url: article.coverImageUrl || '',
      name: article.title,
    },
    tags: [],
    subCategory: {
      ID: 0,
      name: 'Tin tức',
      slug: 'tin-tuc',
    },
  }
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    async function fetchBlog() {
      const slug = commonUtil.getParameterByName('slug')
      if (!slug) {
        setIsLoading(false)
        return
      }

      try {
        const blogID = extractBlogID(slug)
        if (!blogID) {
          const cleanId = slug.replace(/-0$/, '')
          const staticArticle = getArticleById(cleanId)
          if (staticArticle) {
            setBlog(buildStaticBlog(slug, staticArticle))
            return
          }
          throw new Error('Failed to fetch blog: Missing blog ID')
        }

        const data = await blogAPI.getBlogByID(blogID)
        setBlog(data)
      } catch (error) {
        console.error('Failed to fetch blog:', error)
        const cleanId = slug.replace(/-(\d+)$/, '')
        const staticArticle = getArticleById(cleanId)
        if (staticArticle) {
          setBlog(buildStaticBlog(slug, staticArticle))
        }
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
