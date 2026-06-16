'use client'

import StaticImage from '@/components/common/static-image'
import { ParagraphType } from '@/constants/game'
import commonUtil from '@/utils/common'
import dayjs from 'dayjs'
import './styles.scss'
import ArticleHeader from '../../../_components/article-header/ArticleHeader'
import ShareBar from '../../../_components/share-bar/ShareBar'
import RelatedArticlesCarousel from '../../../_components/related-articles/RelatedArticlesCarousel'
import { getEnabledArticles } from '@/src/data/newsArticles'
interface BlogContentProps {
  blog: Blog
}

export default function BlogContent({ blog }: BlogContentProps) {
  const publishDate = blog.publishTimer || blog.publishedAt || blog.createdAt
  const thumbnailUrl = blog.thumbnail?.url || blog.avatar

  const relatedArticles = getEnabledArticles().filter((a) => a.id !== blog.id).slice(0, 3);

  return (
    <article className="blog-article">
      <ArticleHeader blog={blog} />
      <ShareBar title={blog.title} url={`/game/blog/${blog.slug}`} />
      <div className="blog-content-wrapper">
        {blog.description && (
          <p className="mb-3 text-label-lg font-bold md:mb-4">{blog.description}</p>
        )}
        {blog.content && (
          <div
            className="blog-content prose prose-lg mb-3 max-w-none text-dark-500 md:mb-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )}
        {!commonUtil.isEmpty(blog.paragraphs) &&
          blog.paragraphs!.map((item, index) => {
            if (!item) {
              return null;
            }
            if (item.type === ParagraphType.RawHTMLString) {
              return <div key={index} dangerouslySetInnerHTML={{ __html: item.content || '' }} />;
            }
            return null;
          })}
        {blog.author && (
          <div className="mb-3 flex w-full items-center justify-end text-label-lg font-bold md:mb-4">
            {blog.author}
          </div>
        )}
        {!commonUtil.isEmpty(blog.tags) && (
          <div className="flex flex-wrap items-center gap-1 text-label-md">
            <div className="text-dark-200">Tags:</div>
            <div className="flex flex-wrap items-center gap-2">
              {blog.tags.map((tag) => (
                <span key={tag.ID}>#{tag.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <RelatedArticlesCarousel articles={relatedArticles as any} />
    </article>
  );
}
