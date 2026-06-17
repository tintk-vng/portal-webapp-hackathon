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

// Links to static articles always append "-0" (articleId + "-0"). Any trailing
// number > 0 is a real CMS blog ID; "-0" means: look up the static article.
function extractNumericBlogID(slug: string): number | null {
  const match = slug.match(/-(\d+)$/)
  if (!match) return null
  const n = parseInt(match[1], 10)
  return n > 0 ? n : null
}

function stripSuffix(slug: string): string {
  return slug.replace(/-\d+$/, '')
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
        const blogID = extractNumericBlogID(slug)
        if (!blogID) {
          const cleanId = stripSuffix(slug)
          const staticArticle = getArticleById(cleanId)
          if (staticArticle) {
            setBlog(buildStaticBlog(slug, staticArticle))
            return
          }
          throw new Error(`No static article found for slug: ${cleanId}`)
        }

        const data = await blogAPI.getBlogByID(blogID)
        setBlog(data)
      } catch (error) {
        console.error('Failed to fetch blog:', error)
        const cleanId = stripSuffix(slug)
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

