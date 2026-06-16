import { NewsArticle } from '@/src/data/newsArticles'
import Link from 'next/link'
import Image from 'next/image'

export default function NewsCards({ articles }: { articles: NewsArticle[] }) {
  if (!articles || articles.length === 0) return null

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/mua-the-game/tat-ca-tin-tuc"
          className="text-heading-md md:text-heading-lg font-bold text-dark-500 hover:text-blue-500 transition-colors"
        >
          Tin tức
        </Link>
        <Link
          href="/mua-the-game/tat-ca-tin-tuc"
          className="text-label-md font-bold text-blue-500 hover:text-blue-600 transition-colors"
        >
          Xem tất cả
        </Link>
      </div>

      {/* Grid container: 1 col on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            className="group flex flex-col cursor-pointer bg-white rounded-2xl p-3 border border-dark-50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:-translate-y-1"
            href={`/mua-the-game/tin-tuc?slug=${article.id}-0`}
          >
            {/* Aspect Ratio 16:9 for cover image box */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-dark-50 bg-dark-25">
              {article.coverImageUrl && (
                <Image
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  src={article.coverImageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loader={({ src }) => src}
                  unoptimized
                />
              )}
              {article.relatedPublisherId && (
                <span className="absolute left-2 top-2 rounded-lg bg-blue-500 px-2 py-0.5 text-label-xs font-bold text-white uppercase shadow-sm">
                  {article.relatedPublisherId}
                </span>
              )}
            </div>

            <div className="mt-3 line-clamp-2 text-label-lg font-bold text-dark-500 group-hover:text-blue-500 transition-colors">
              {article.title}
            </div>
            <div className="mt-1 text-label-xs text-dark-300">
              {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
            </div>
            <div className="mt-2 line-clamp-2 text-label-md text-dark-300">
              {article.summary}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

