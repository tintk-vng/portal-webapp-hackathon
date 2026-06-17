'use client'

import './share-bar.scss'

interface ShareBarProps {
  title: string
  url: string
}

export default function ShareBar({ title, url }: ShareBarProps) {
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : ''

  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
  ]

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  return (
    <div className="share-bar flex items-center gap-4 mt-4">
      <span className="text-label-sm font-medium text-dark-400">Share:</span>
      {shareLinks.map((link) => (
        <button
          key={link.name}
          className="share-button text-label-sm text-dark-500 hover:text-primary-500"
          onClick={() => handleShare(link.url)}
        >
          {link.name}
        </button>
      ))}
    </div>
  )
}
