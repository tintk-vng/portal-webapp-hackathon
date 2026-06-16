import blogAPI from '@/api-client/common/blog'
import { getActiveCampaign } from '@/src/data/campaigns'
import { getEnabledArticles } from '@/src/data/newsArticles'
import Main from './_components/main'

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

  const activeCampaign = getActiveCampaign()
  const activeArticles = getEnabledArticles()

  return (
    <Main
      subCategoryID={subCategoryID}
      activeCampaign={activeCampaign}
      activeArticles={activeArticles}
    />
  )
}
