import blogModel from '@/models/common/blog'
import axiosClient from '../client'

const INTERNAL_BASE_URL = process.env.NEXT_PUBLIC_INTERNAL_ZLP_WEBSITE_BASE_URL || ''
// const ZLP_TELCO_PORTAL_WEBAPP_BASE_URL =
//   process.env.NEXT_PUBLIC_ZLP_TELCO_PORTAL_WEBAPP_BASE_URL || ''
const REVALIDATE = 60

const blogAPI = {
  async getCategories() {
    const url = `${INTERNAL_BASE_URL}/zlp-website/news-categories`
    const response = await fetch(url, { next: { revalidate: REVALIDATE } })
    return blogModel.modelCategories(await response.json())
  },

  // async getBlogs(params: { subCategoryID: number; limit: number; offset: number }) {
  //   const { subCategoryID, limit, offset } = params
  //   const url = `https://zlpdev-telco-portal-webapp.zalopay.vn/api/blogs?subCategoryID=${subCategoryID}&limit=${limit}&offset=${offset}`
  //   const response = await fetch(url, { next: { revalidate: REVALIDATE } })
  //   return blogModel.modelBlogs(await response.json())
  // },

  async getBlogsBySubCategoryID(params: { subCategoryID: number; limit: number; offset: number }) {
    const { subCategoryID, limit, offset } = params
    const url = `/api/v1/blogs?sub_category_id=${subCategoryID}&limit=${limit}&offset=${offset}`
    const response = await axiosClient.get(url)
    return blogModel.modelBlogs(response)
  },

  async getBlogByID(ID: number): Promise<Blog | null> {
    const url = `/api/v1/blogs/${ID}`
    const response = await axiosClient.get(url)
    return blogModel.modelBlog(response)
  },
}

export default blogAPI
