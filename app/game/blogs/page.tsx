import blogAPI from '@/api-client/common/blog'
import { getEnabledArticles } from '@/src/data/newsArticles'
import BlogCard from './_components/blog-card'
import EmptyState from './_components/empty-state'
import RecentBlogs from './_components/recent-blogs'

const CATEGORY_SLUG = 'blog'
const SUB_CATEGORY_SLUG = 'choi-game'

async function fetchSubCategoryID(): Promise<undefined | number> {
  const categories = await blogAPI.getCategories()
  const matchedCategory = categories.find((category: Category) => category.slug === CATEGORY_SLUG)
  if (!matchedCategory?.ID) {
    return undefined
  }
  const matchedSubCategory = matchedCategory.subCategories?.find(
    (category: Category) => category.slug === SUB_CATEGORY_SLUG
  )
  if (!matchedSubCategory?.ID) {
    return undefined
  }
  return matchedSubCategory.ID
}

export default async function Page() {
  let subCategoryID: number | undefined
  let error: Error | null = null

  try {
    subCategoryID = await fetchSubCategoryID()
  } catch (e) {
    error = e as Error
  }

  const activeArticles = getEnabledArticles()

  return (
    <div>
      <div className="mb-3 text-heading-md md:mb-4 md:text-heading-lg">Tin tức</div>

      {(() => {
        if (activeArticles.length > 0) {
          const blogs = activeArticles.map(article => ({
            ID: 0,
            slug: article.id,
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
          }))

          return (
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          )
        }

        if (error || !subCategoryID) {
          return <EmptyState />
        }

        return <RecentBlogs subCategoryID={subCategoryID} />
      })()}
    </div>
  )
}

