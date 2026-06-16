import React from 'react'
import Link from 'next/link'
import StaticImage from '@/components/common/static-image'
import './related-articles.scss'

interface RelatedArticlesCarouselProps {
  articles: Blog[] // Assuming Blog type is globally available
}

export default function RelatedArticlesCarousel({ articles }: RelatedArticlesCarouselProps) {
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <section className="related-articles my-8">
      <h2 className="text-heading-md mb-4">Bài viết liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link key={article.ID} href={`/game/blog/${article.slug}`} className="block rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
            <div className="relative aspect-[16/9] w-full">
              <StaticImage
                src={article.thumbnail?.url || article.avatar}
                alt={article.title}
                fill
                className="object-cover"
                loader={({ src }) => src}
              />
            </div>
            <div className="p-3 bg-white">
              <h3 className="text-label-lg font-semibold line-clamp-2">{article.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
