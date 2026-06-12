'use client'

import useCustomSWR from '@/hooks/use-custom-swr'
import eventsAPI from '@/api-client/common/events'

export default function EventNews() {
  const { data } = useCustomSWR('game_events', () => eventsAPI.getEvents())
  const posts = data && !data.default_state ? data.news_posts : []

  if (!posts || posts.length === 0) return null

  return (
    <div className="mt-4">
      <p className="heading-sm mb-2">Sự kiện đang diễn ra</p>
      <ul className="flex flex-col gap-2">
        {posts.map((post, index) => (
          <li key={index} className="rounded-lg bg-dark-25 px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-sm">{post.title}</span>
              <span className="label-xs text-dark-200">
                {post.publisher} · {post.game}
              </span>
            </div>
            {post.period ? <p className="paragraph-md text-dark-200">{post.period}</p> : null}
            {post.body ? <p className="paragraph-md">{post.body}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}