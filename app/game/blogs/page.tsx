import blogAPI from '@/api-client/common/blog'
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

  return (
    <div>
      <div className="mb-3 text-heading-md md:mb-4 md:text-heading-lg">Tin tức</div>

      {(() => {
        if (error || !subCategoryID) {
          return <EmptyState />
        }

        return <RecentBlogs subCategoryID={subCategoryID} />
      })()}
    </div>
  )
}
