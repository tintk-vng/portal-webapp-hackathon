import { ParagraphType } from '@/constants/game'

type SimpelCTA = {
  __component: ParagraphType.SimpleCTA
  text: string
  type: string
  url: string
  popup?: {
    title: string
    message: string
    description: string
    buttons?: { url: string; icon: { url: string } }[]
    QR: {
      url: string
    }
  }
}

type ParagraphHTML = {
  __component: ParagraphType.RawHTMLString
  paragraph: string
}

type PaymentService = {
  __component: ParagraphType.PaymentService
  data: Record<string, unknown>
}

type Paragraph = SimpelCTA | ParagraphHTML | PaymentService

const mapSimpleCTA = (item: SimpelCTA) => {
  try {
    const { url, text, type, popup } = item
    if (type === 'DEEPLINK' && !popup) {
      return null
    }

    const buttons = popup?.buttons || []
    const buttonsLength = buttons?.length || 0

    return {
      url,
      text,
      type,
      iosDownloadUrl: buttonsLength > 0 ? buttons[0].url || null : null,
      androidDownloadUrl: buttonsLength > 0 ? buttons[1].url || null : null,
      desktop: {
        QRCode: popup?.QR.url || null,
        appStoreLogo: buttonsLength > 0 ? buttons[0].icon.url || null : null,
        googlePlayLogo: buttonsLength > 0 ? buttons[1].icon.url || null : null,
        title: popup?.title || null,
        message: popup?.message || null,
        description: popup?.description || null,
      },
    }
  } catch (error) {
    return null
  }
}

export const mapParagraphs = (paragraphs?: Paragraph[]) => {
  if (!paragraphs || !paragraphs.length) {
    return []
  }
  try {
    const mappedParagraphs = paragraphs.map((item) => {
      if (item.__component === ParagraphType.RawHTMLString) {
        return {
          type: ParagraphType.RawHTMLString,
          content: item.paragraph,
          ctaData: null,
        }
      }

      if (item.__component === ParagraphType.PaymentService) {
        return {
          type: ParagraphType.PaymentService,
          data: item,
        }
      }

      return {
        type: ParagraphType.SimpleCTA,
        ctaData: mapSimpleCTA(item),
        content: null,
      }
    })

    return mappedParagraphs
  } catch (error) {
    return []
  }
}

const blogModel = {
  modelCategories: (response: any): Category[] => {
    try {
      return response
        .map((category: any) => ({
          ID: category.id,
          name: category.name,
          slug: category.slug,
          subCategories: category.news_sub_categories.map((subCategory: any) => ({
            ID: subCategory.id,
            name: subCategory.name,
            slug: subCategory.slug,
          })),
        }))
        .filter(Boolean)
    } catch (error) {
      console.log('Failed to model categories: ', error)
      return []
    }
  },

  modelBlog: (response: any): Blog | null => {
    try {
      return {
        ID: response.id,
        slug: response.slug,
        title: response.title,
        description: response.description,
        content: response.content,
        paragraphs: mapParagraphs(response.paragraphs),
        thumbnail: {
          url: response.main_image?.url,
          name: response.main_image?.name,
        },
        avatar: response.avatar,
        author: response.author,
        createdAt: response.created_at,
        updatedAt: response.updated_at,
        publishedAt: response.published_at,
        publishTimer: response.publish_timer,
        tags:
          response.tags?.map((tag: any) => ({
            ID: tag.id,
            name: tag.tag_name,
          })) || [],
        subCategory: response.news_sub_category,
      }
    } catch (error) {
      console.log('Failed to model blog: ', error)
      return null
    }
  },

  modelBlogs: (response: any): Blog[] => {
    try {
      return response.map((blog: any) => blogModel.modelBlog(blog))
    } catch (error) {
      console.log('Failed to model blogs: ', error)
      return []
    }
  },
}

export default blogModel
