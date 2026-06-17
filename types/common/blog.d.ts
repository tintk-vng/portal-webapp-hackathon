interface Category {
  ID: number
  name: string
  slug: string
  subCategories?: Category[]
}

interface Blog {
  ID: number
  slug: string
  title: string
  subtitle?: string
  description: string
  content?: string
  paragraphs?: any[]
  thumbnail: {
    url: string
    name: string
  }
  avatar: string
  author: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  publishTimer: string
  tags: {
    ID: number
    name: string
  }[]
  subCategory: Category
}
