'use client'

import { SupportRequest } from './support-request'
import { UsageGuide } from './usage-guide'

export default function GooglePlayTutorial() {
  return (
    <div className="grid gap-2 md:grid-cols-2 md:gap-5">
      <UsageGuide />

      <SupportRequest />
    </div>
  )
}
