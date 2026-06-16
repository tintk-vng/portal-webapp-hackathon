'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

/* ─── Types ─── */
type SkuDiscount = {
  id: string
  publisherId?: string
  skuId?: string
  discountPercent?: number
  enabled: boolean
}

type Campaign = {
  id: string
  title: string
  subtitle?: string
  bannerImageUrl: string
  mobileBannerImageUrl?: string
  altText: string
  targetPublisherId?: string
  targetGameIds?: string[]
  discountPercent?: number
  discountText?: string
  skuDiscounts?: SkuDiscount[]
  ctaText?: string
  articleId?: string
  enabled: boolean
  priority: number
  isTopBanner?: boolean
  validFrom?: string
  validTo?: string
  themeClassName?: string
}

type StatusHistoryEntry = {
  status: string
  timestamp: string
}

type Proposal = {
  id: string
  title: string
  targetPublisherId: string
  targetGameIds: string[]
  discountPercent: number
  bannerTitle: string
  bannerSubtitle: string
  bannerImageUrl: string
  mobileBannerImageUrl?: string
  coverImageUrl?: string
  ctaText: string
  discountText?: string
  altText?: string
  imagePrompt?: string
  articleTitle: string
  articleSummary: string
  articleContent: string
  recommendedPopularSearchItems: any[]
  proposedFileChanges: string[]
  createdAt: string
  status: 'scanned' | 'draft' | 'approved' | 'applied' | 'rejected'
  selectedPublisher?: string
  alternativesConsidered?: string[]
  researchSourceIds?: string[]
  researchVisitedUrls?: string[]
  reasoningSummary?: string
  validationWarnings?: string[]
  lastScannedAt?: string
  statusHistory?: StatusHistoryEntry[]
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    scanned: { bg: 'bg-violet-500/20 border-violet-500/40', text: 'text-violet-300', label: 'Mới quét' },
    draft: { bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-300', label: 'Bản nháp' },
    approved: { bg: 'bg-blue-500/20 border-blue-500/40', text: 'text-blue-300', label: 'Đã duyệt' },
    applied: { bg: 'bg-emerald-500/20 border-emerald-500/40', text: 'text-emerald-300', label: 'Đang kích hoạt' },
    rejected: { bg: 'bg-rose-500/20 border-rose-500/40', text: 'text-rose-300', label: 'Đã từ chối' },
  }
  const style = map[status] || { bg: 'bg-slate-500/20 border-slate-500/40', text: 'text-slate-300', label: status }
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}

/* ─── Collapsible Section ─── */
function Section({ title, icon, count, defaultOpen = true, children, accentColor = 'blue' }: {
  title: string; icon: string; count: number; defaultOpen?: boolean; children: React.ReactNode; accentColor?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const colorMap: Record<string, string> = {
    violet: 'from-violet-500/10 to-transparent border-violet-500/30',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/30',
    amber: 'from-amber-500/10 to-transparent border-amber-500/30',
    blue: 'from-blue-500/10 to-transparent border-blue-500/30',
  }
  const countColorMap: Record<string, string> = {
    violet: 'bg-violet-500/30 text-violet-200',
    emerald: 'bg-emerald-500/30 text-emerald-200',
    amber: 'bg-amber-500/30 text-amber-200',
    blue: 'bg-blue-500/30 text-blue-200',
  }
  return (
    <div className={`rounded-xl border bg-gradient-to-b ${colorMap[accentColor] || colorMap.blue} backdrop-blur overflow-hidden transition-all`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${countColorMap[accentColor] || countColorMap.blue}`}>
            {count}
          </span>
        </div>
        <svg className={`h-5 w-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

/* ─── Campaign Table ─── */
function CampaignTable({ proposals, onSelect, selectedId, actions }: {
  proposals: Proposal[]
  onSelect: (p: Proposal) => void
  selectedId?: string
  actions: (p: Proposal) => React.ReactNode
}) {
  if (proposals.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-slate-500">
        Không có chiến dịch nào trong mục này.
      </div>
    )
  }
  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-slate-500">
            <th className="pb-3 pr-4 font-semibold">Chiến dịch</th>
            <th className="hidden pb-3 pr-4 font-semibold md:table-cell">Nhà phát hành</th>
            <th className="hidden pb-3 pr-4 font-semibold sm:table-cell">Giảm giá</th>
            <th className="pb-3 pr-4 font-semibold">Trạng thái</th>
            <th className="pb-3 font-semibold text-right sticky right-0 bg-transparent">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {proposals.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelect(p)}
              className={`cursor-pointer transition hover:bg-white/[0.03] ${selectedId === p.id ? 'bg-white/[0.05] ring-1 ring-inset ring-blue-500/30' : ''}`}
            >
              <td className="py-3.5 pr-4">
                <div className="font-semibold text-white truncate max-w-[240px]">{p.bannerTitle}</div>
                <div className="text-xs text-slate-500 truncate max-w-[240px] mt-0.5">{p.id}</div>
              </td>
              <td className="hidden py-3.5 pr-4 md:table-cell">
                <span className="rounded-md bg-slate-800/80 px-2 py-1 text-xs font-semibold text-slate-300 uppercase">{p.targetPublisherId}</span>
              </td>
              <td className="hidden py-3.5 pr-4 sm:table-cell">
                <span className="font-bold text-emerald-400">-{p.discountPercent}%</span>
              </td>
              <td className="py-3.5 pr-4">
                <StatusBadge status={p.status} />
              </td>
              <td className="py-3.5 text-right sticky right-0" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end gap-1.5 flex-nowrap">
                  {actions(p)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Timeline ─── */
function Timeline({ history }: { history?: StatusHistoryEntry[] }) {
  if (!history || history.length === 0) return null
  const statusColors: Record<string, string> = {
    scanned: 'bg-violet-500',
    draft: 'bg-amber-500',
    approved: 'bg-blue-500',
    applied: 'bg-emerald-500',
    rejected: 'bg-rose-500',
  }
  const statusLabels: Record<string, string> = {
    scanned: 'Mới quét',
    draft: 'Bản nháp',
    approved: 'Đã duyệt',
    applied: 'Đã kích hoạt',
    rejected: 'Đã từ chối',
  }
  return (
    <div className="space-y-0">
      {history.map((entry, i) => (
        <div key={i} className="flex items-start gap-3 py-2">
          <div className="flex flex-col items-center">
            <div className={`h-2.5 w-2.5 rounded-full ${statusColors[entry.status] || 'bg-slate-500'} ring-2 ring-slate-900`} />
            {i < history.length - 1 && <div className="w-px flex-1 bg-slate-700 min-h-[20px]" />}
          </div>
          <div className="flex-1 -mt-0.5">
            <span className="text-xs font-semibold text-slate-200">{statusLabels[entry.status] || entry.status}</span>
            <span className="ml-2 text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString('vi-VN')}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Drawer ─── */
function Drawer({ proposal, onClose, editFields, setEditFields, onSave, onAction, actionLoading }: {
  proposal: Proposal
  onClose: () => void
  editFields: any
  setEditFields: (fn: any) => void
  onSave: () => void
  onAction: (action: string) => void
  actionLoading: string | null
}) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const isEditable = proposal.status === 'scanned' || proposal.status === 'draft'

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-white/[0.08] bg-slate-900/95 backdrop-blur-xl shadow-2xl sm:w-[55%] lg:w-[48%] animate-slide-in"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">Chi tiết Campaign</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{proposal.id}</p>
          </div>
          <div className="flex items-center gap-2">
            {proposal.status !== 'applied' && (
              <button
                onClick={() => {
                  if (confirm(`Xóa proposal "${proposal.id}"? Hành động này không thể hoàn tác.`)) {
                    onAction('delete-proposal')
                  }
                }}
                disabled={actionLoading !== null}
                className="rounded-lg p-2 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition disabled:opacity-50"
                title="Xóa proposal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white transition">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Drawer Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Banner Preview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Banner Preview</h3>
            {(() => {
              const imgUrl = editFields?.bannerImageUrl || proposal.bannerImageUrl
              const hasBgImage = !!imgUrl
              return (
                <div
                  className="relative overflow-hidden rounded-xl shadow-lg min-h-[140px] flex flex-col justify-center bg-slate-900"
                  style={hasBgImage ? {
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : undefined}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="relative z-10 p-5 flex flex-col justify-center min-h-[140px]">
                    <div className="min-w-0 text-white">
                      {(proposal.discountText || proposal.discountPercent) && (
                        <div className="mb-2 inline-flex rounded bg-white px-2 py-0.5 text-xs font-bold text-blue-600">
                          {proposal.discountText || `Giảm ${proposal.discountPercent}%`}
                        </div>
                      )}
                      <h4 className="font-extrabold text-xl leading-tight text-white font-sans">
                        {editFields?.bannerTitle || proposal.bannerTitle}
                      </h4>
                      {(editFields?.bannerSubtitle || proposal.bannerSubtitle) && (
                        <p className="text-sm font-medium mt-1 text-white/80">
                          {editFields?.bannerSubtitle || proposal.bannerSubtitle}
                        </p>
                      )}
                      {proposal.ctaText && (
                        <div className="mt-3">
                          <span className="inline-flex rounded-md bg-white px-3 py-1.5 text-xs font-bold text-blue-600 shadow-sm">
                            {proposal.ctaText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Nạp ngay button */}
          <Link
            href={`/game?telco_code=${proposal.targetPublisherId.toUpperCase()}`}
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Nạp ngay tại {proposal.targetPublisherId.charAt(0).toUpperCase() + proposal.targetPublisherId.slice(1)} →
          </Link>

          {/* Editable Fields */}
          {isEditable && editFields && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Chỉnh sửa Banner & Nội dung</h3>
              <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                {(['bannerTitle', 'bannerSubtitle'] as const).map((key) => {
                  const labels: Record<string, string> = {
                    bannerTitle: 'Tiêu đề Banner',
                    bannerSubtitle: 'Mô tả Banner',
                  }
                  return (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">{labels[key]}</label>
                      <input
                        type="text"
                        value={(editFields as any)[key]}
                        onChange={(e) => setEditFields((prev: any) => prev ? { ...prev, [key]: e.target.value } : null)}
                        className="w-full rounded-lg border border-white/[0.08] bg-slate-950/50 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
                      />
                    </div>
                  )
                })}
                {(['bannerImageUrl', 'mobileBannerImageUrl', 'coverImageUrl'] as const).map((key) => {
                  const labels: Record<string, string> = {
                    bannerImageUrl: 'URL ảnh Banner (Desktop)',
                    mobileBannerImageUrl: 'URL ảnh Banner (Mobile)',
                    coverImageUrl: 'URL ảnh đại diện bài viết',
                  }
                  return (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">{labels[key]}</label>
                      <input
                        type="text"
                        value={(editFields as any)[key]}
                        onChange={(e) => setEditFields((prev: any) => prev ? { ...prev, [key]: e.target.value } : null)}
                        className="w-full rounded-lg border border-white/[0.08] bg-slate-950/50 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
                      />
                    </div>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setEditFields((prev: any) => prev ? {
                    ...prev,
                    coverImageUrl: prev.bannerImageUrl
                  } : null)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-slate-800/50 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700/60 transition w-full justify-center"
                >
                  ↕ Đồng bộ: dùng URL Banner làm Thumbnail bài viết
                </button>
                <button
                  onClick={onSave}
                  disabled={actionLoading !== null}
                  className="w-full rounded-lg bg-blue-600/90 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {actionLoading?.startsWith('save-') ? 'Đang lưu...' : 'Lưu chỉnh sửa'}
                </button>
              </div>
            </div>
          )}

          {/* AI Reasoning */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Lý do đề xuất của AI</h3>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {proposal.reasoningSummary || 'Không có mô tả phân tích.'}
            </div>
          </div>

          {/* Validation Warnings */}
          {proposal.validationWarnings && proposal.validationWarnings.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">Cảnh báo Validation</h3>
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 text-sm text-amber-300">
                <ul className="list-disc list-inside space-y-1">
                  {proposal.validationWarnings.map((warn, i) => <li key={i}>{warn}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* Timeline / History */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Lịch sử trạng thái</h3>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              {proposal.statusHistory && proposal.statusHistory.length > 0 ? (
                <Timeline history={proposal.statusHistory} />
              ) : (
                <div className="flex items-start gap-3 py-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-500 ring-2 ring-slate-900 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Tạo lúc</span>
                    <span className="ml-2 text-xs text-slate-500">{new Date(proposal.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Config Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Thông số cấu hình</h3>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2.5 text-sm">
              {[
                { label: 'Giảm giá', value: <span className="font-bold text-emerald-400">-{proposal.discountPercent}%</span> },
                { label: 'Nhà phát hành', value: <span className="font-bold uppercase">{proposal.targetPublisherId}</span> },
                { label: 'Game áp dụng', value: <span className="text-xs text-right max-w-[200px] truncate" title={proposal.targetGameIds?.join(', ')}>{proposal.targetGameIds?.join(', ') || '(không)'}</span> },
                { label: 'Trạng thái', value: <StatusBadge status={proposal.status} /> },
                { label: 'Ngày tạo', value: <span className="text-xs text-slate-300">{new Date(proposal.createdAt).toLocaleString('vi-VN')}</span> },
              ].map(({ label, value }, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-slate-400">{label}</span>
                  {value}
                </div>
              ))}
            </div>
          </div>

          {/* CMS Article */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Bài viết đi kèm (CMS)</h3>
            {isEditable && editFields ? (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tiêu đề bài viết</label>
                  <input type="text" value={editFields.articleTitle} onChange={(e) => setEditFields((prev: any) => prev ? { ...prev, articleTitle: e.target.value } : null)}
                    className="w-full rounded-lg border border-white/[0.08] bg-slate-950/50 px-3 py-2 text-sm text-white focus:border-blue-500/50 focus:outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tóm tắt</label>
                  <input type="text" value={editFields.articleSummary} onChange={(e) => setEditFields((prev: any) => prev ? { ...prev, articleSummary: e.target.value } : null)}
                    className="w-full rounded-lg border border-white/[0.08] bg-slate-950/50 px-3 py-2 text-sm text-white focus:border-blue-500/50 focus:outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nội dung (HTML)</label>
                  <textarea rows={5} value={editFields.articleContent} onChange={(e) => setEditFields((prev: any) => prev ? { ...prev, articleContent: e.target.value } : null)}
                    className="w-full rounded-lg border border-white/[0.08] bg-slate-950/50 px-3 py-2 text-xs text-white font-mono focus:border-blue-500/50 focus:outline-none transition" />
                </div>
                <div className="mt-2.5">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Xem trước bài viết (Live Preview)</label>
                  <div className="rounded-lg border border-white/[0.08] bg-slate-950/40 p-4 text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto cms-article-preview font-sans"
                    dangerouslySetInnerHTML={{ __html: editFields.articleContent }} />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
                <h4 className="font-bold text-white text-sm">{proposal.articleTitle}</h4>
                <p className="text-xs text-slate-400 italic">{proposal.articleSummary}</p>
                <hr className="border-white/[0.06]" />
                <div className="text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto cms-article-preview font-sans"
                  dangerouslySetInnerHTML={{ __html: proposal.articleContent.includes('<') ? proposal.articleContent : proposal.articleContent.replace(/\n/g, '<br/>') }} />
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer — Quick Actions */}
        <div className="border-t border-white/[0.06] px-6 py-4 space-y-2 bg-slate-950/50">
          {proposal.status === 'scanned' && (
            <>
              <button onClick={() => onAction('acknowledge')} disabled={actionLoading !== null}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition disabled:opacity-50">
                Chuyển thành Bản nháp
              </button>
              <button onClick={() => onAction('reject')} disabled={actionLoading !== null}
                className="w-full rounded-xl bg-rose-600/80 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition disabled:opacity-50">
                Từ chối
              </button>
            </>
          )}
          {proposal.status === 'draft' && (
            <>
              <button onClick={() => onAction('approve')} disabled={actionLoading !== null}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition disabled:opacity-50">
                Phê duyệt Chiến dịch
              </button>
              <button onClick={() => onAction('reject')} disabled={actionLoading !== null}
                className="w-full rounded-xl bg-rose-600/80 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition disabled:opacity-50">
                Từ chối
              </button>
            </>
          )}
          {proposal.status === 'approved' && (
            <button onClick={() => onAction('apply')} disabled={actionLoading !== null}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white hover:from-emerald-500 hover:to-teal-500 transition disabled:opacity-50">
              Áp dụng & Kích hoạt chiến dịch
            </button>
          )}
          {proposal.status === 'rejected' && (
            <button onClick={() => onAction('revert')} disabled={actionLoading !== null}
              className="w-full rounded-xl bg-amber-600/80 py-3 text-sm font-bold text-white hover:bg-amber-600 transition disabled:opacity-50">
              Khôi phục về Bản nháp
            </button>
          )}
          {(proposal.status === 'scanned' || proposal.status === 'draft') && (
            <button
              onClick={() => onAction('enrich-content')}
              disabled={actionLoading !== null}
              className="w-full rounded-xl border border-teal-500/40 bg-teal-900/30 py-2.5 text-sm font-semibold text-teal-300 hover:bg-teal-800/40 transition disabled:opacity-50"
            >
              {actionLoading?.startsWith('enrich-content') ? '⏳ Đang cập nhật...' : '🔄 Lấy nội dung mới nhất từ website'}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cms-article-preview h3 {
          font-size: 1.125rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        .cms-article-preview h4 {
          font-size: 1rem;
          font-weight: 700;
          margin-top: 0.75rem;
          margin-bottom: 0.375rem;
          color: #fff;
        }
        .cms-article-preview p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        .cms-article-preview ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .cms-article-preview ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .cms-article-preview li {
          margin-bottom: 0.25rem;
        }
        .cms-article-preview a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}

/* ─── Main Page ─── */
export default function CampaignMktPage() {
  const [topBannerCampaign, setTopBannerCampaign] = useState<Campaign | null>(null)
  const [liveCampaigns, setLiveCampaigns] = useState<Campaign[]>([])
  const [disabledCampaigns, setDisabledCampaigns] = useState<Campaign[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [scanOutput, setScanOutput] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [editFields, setEditFields] = useState<{
    bannerTitle: string; bannerSubtitle: string; bannerImageUrl: string
    mobileBannerImageUrl: string; coverImageUrl: string
    articleTitle: string; articleSummary: string; articleContent: string
  } | null>(null)

  useEffect(() => {
    if (selectedProposal) {
      setEditFields({
        bannerTitle: selectedProposal.bannerTitle || '',
        bannerSubtitle: selectedProposal.bannerSubtitle || '',
        bannerImageUrl: selectedProposal.bannerImageUrl || '',
        mobileBannerImageUrl: selectedProposal.mobileBannerImageUrl || '',
        coverImageUrl: selectedProposal.coverImageUrl || '',
        articleTitle: selectedProposal.articleTitle || '',
        articleSummary: selectedProposal.articleSummary || '',
        articleContent: selectedProposal.articleContent || ''
      })
    } else {
      setEditFields(null)
    }
  }, [selectedProposal])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/campaign')
      const data = await res.json()
      if (res.ok) {
        setTopBannerCampaign(data.topBannerCampaign)
        setLiveCampaigns(data.liveCampaigns || [])
        setDisabledCampaigns(data.disabledCampaigns || [])
        setProposals(data.proposals || [])
      }
    } catch (err) {
      console.error('Network error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const showMsg = (type: 'success' | 'error' | 'info', text: string) => setMessage({ type, text })

  const apiAction = async (action: string, body: Record<string, any> = {}) => {
    const key = `${action}-${body.proposalId || body.campaignId || ''}`
    setActionLoading(key)
    showMsg('info', 'Đang xử lý...')
    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...body })
      })
      const data = await res.json()
      if (res.ok) {
        showMsg('success', data.message || 'Thành công!')
        if (data.proposal && selectedProposal?.id === (body.proposalId)) {
          setSelectedProposal(data.proposal)
        }
        fetchData()
        if (data.stdout) setScanOutput(data.stdout)
        return data
      } else {
        showMsg('error', data.error || 'Thao tác thất bại.')
      }
    } catch {
      showMsg('error', 'Lỗi mạng.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleScan = () => apiAction('scan')
  const handleToggleTopBanner = (campaignId: string) => apiAction('set-top-banner', { campaignId })

  const handleDrawerAction = async (action: string) => {
    if (!selectedProposal) return
    const result = await apiAction(action, { proposalId: selectedProposal.id })
    if (action === 'delete-proposal' && result?.status === 'success') {
      setSelectedProposal(null)
    }
  }

  const handleSaveEdits = () => {
    if (!selectedProposal || !editFields) return
    apiAction('update', { proposalId: selectedProposal.id, ...editFields })
  }

  // Split proposals into sections
  const scannedProposals = proposals.filter(p => p.status === 'scanned')
  const appliedProposals = proposals.filter(p => p.status === 'applied' || p.status === 'approved')

  function latestUpdateTs(p: Proposal): number {
    const times = [new Date(p.createdAt).getTime()]
    if (Array.isArray(p.statusHistory)) {
      p.statusHistory.forEach((h) => {
        const t = new Date(h.timestamp).getTime()
        if (!isNaN(t)) times.push(t)
      })
    }
    return Math.max(...times)
  }

  const draftAndRejected = proposals
    .filter(p => p.status === 'draft' || p.status === 'rejected')
    .sort((a, b) => latestUpdateTs(b) - latestUpdateTs(a))

  return (
    <div className="min-h-screen bg-[#0B1120] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500">
          <Link href="/game" className="hover:text-blue-400 transition">Mua thẻ game</Link>
          <span>/</span>
          <span className="text-slate-300">Campaign Dashboard</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Campaign Console</h1>
            <p className="mt-1.5 text-sm text-slate-500">Quản lý chiến dịch khuyến mãi, quét tín hiệu thị trường tự động.</p>
          </div>
          <button
            onClick={handleScan}
            disabled={actionLoading !== null}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-50 transition-all active:scale-[0.97]"
          >
            {actionLoading === 'scan-' ? (
              <><svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Đang quét...</>
            ) : (
              <><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> Quét Campaign mới</>
            )}
          </button>
        </div>

        {/* Toast */}
        {message && (
          <div className={`rounded-xl p-4 shadow-lg border transition-all ${
            message.type === 'success' ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
            : message.type === 'info' ? 'bg-blue-950/60 border-blue-500/30 text-blue-200 animate-pulse'
            : 'bg-rose-950/60 border-rose-500/30 text-rose-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-sm">{message.text}</span>
              <button onClick={() => setMessage(null)} className="ml-4 text-lg font-bold opacity-60 hover:opacity-100">&times;</button>
            </div>
          </div>
        )}

        {/* Scan Output */}
        {scanOutput && (
          <div className="rounded-xl border border-white/[0.06] bg-slate-950/80 p-4 font-mono text-xs text-slate-400">
            <div className="mb-2 flex justify-between text-sm text-slate-200 font-semibold">
              <span>Nhật ký quét hệ thống</span>
              <button onClick={() => setScanOutput(null)} className="text-xs underline hover:text-white">Ẩn</button>
            </div>
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap">{scanOutput}</pre>
          </div>
        )}

        {/* ═══ Top Banner Card ═══ */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/80 via-slate-800/40 to-slate-900/80 p-6 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              <h2 className="text-lg font-bold text-white">Top Banner Đang Live</h2>
            </div>
            <Link href="/game" target="_blank" className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.05] hover:text-white transition">
              Xem trên site →
            </Link>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-28 rounded-xl bg-white/[0.04]" />
              <div className="h-4 w-2/3 rounded bg-white/[0.04]" />
            </div>
          ) : topBannerCampaign ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Mini Banner Preview */}
              {(() => {
                const hasBgImage = !!topBannerCampaign.bannerImageUrl
                return (
                  <div
                    className="relative flex-1 overflow-hidden rounded-xl shadow-inner min-h-[100px] flex flex-col justify-center bg-slate-900"
                    style={hasBgImage ? {
                      backgroundImage: `url(${topBannerCampaign.bannerImageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : undefined}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0" />
                    <div className="relative z-10 p-4 min-h-[100px] flex flex-col justify-center">
                      {topBannerCampaign.discountText && (
                        <div className="mb-1.5 self-start rounded bg-white px-2 py-0.5 text-[10px] font-extrabold text-blue-600">{topBannerCampaign.discountText}</div>
                      )}
                      <h3 className="font-bold text-base md:text-lg leading-tight text-white">{topBannerCampaign.title}</h3>
                      {topBannerCampaign.subtitle && (
                        <p className="text-xs text-white/85 mt-0.5">{topBannerCampaign.subtitle}</p>
                      )}
                    </div>
                  </div>
                )
              })()}
              {/* Info */}
              <div className="sm:w-64 space-y-2 text-sm">
                {[
                  { l: 'Publisher', v: topBannerCampaign.targetPublisherId || 'Tất cả' },
                  { l: 'Giảm giá', v: topBannerCampaign.discountPercent ? `${topBannerCampaign.discountPercent}%` : '—' },
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between border-b border-white/[0.04] pb-1.5">
                    <span className="text-slate-500">{l}</span>
                    <span className="font-semibold text-slate-200">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Chưa có chiến dịch nào được kích hoạt.</p>
          )}
        </div>

        {/* ═══ Section 1: Mới quét (Scanned) ═══ */}
        <Section title="Mới quét" icon="🔍" count={scannedProposals.length} defaultOpen={scannedProposals.length > 0} accentColor="violet">
          <CampaignTable
            proposals={scannedProposals}
            onSelect={setSelectedProposal}
            selectedId={selectedProposal?.id}
            actions={(p) => (
              <>
                <button onClick={() => apiAction('acknowledge', { proposalId: p.id })} disabled={actionLoading !== null}
                  className="rounded-lg bg-blue-600/80 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600 transition disabled:opacity-50 whitespace-nowrap">
                  Chuyển Draft
                </button>
                <button onClick={() => apiAction('reject', { proposalId: p.id })} disabled={actionLoading !== null}
                  className="rounded-lg bg-rose-600/70 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition disabled:opacity-50 whitespace-nowrap">
                  Từ chối
                </button>
              </>
            )}
          />
        </Section>

        {/* ═══ Section 2: Đang chạy (Live) ═══ */}
        <Section title="Đang chạy (Live)" icon="🟢" count={liveCampaigns.length + appliedProposals.length} defaultOpen={true} accentColor="emerald">
          {/* Live campaigns from campaigns.ts */}
          {liveCampaigns.length > 0 && (
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Chiến dịch</th>
                    <th className="hidden pb-3 pr-4 font-semibold md:table-cell">Publisher</th>
                    <th className="hidden pb-3 pr-4 font-semibold sm:table-cell">Giảm giá</th>
                    <th className="pb-3 pr-4 font-semibold">Top Banner</th>
                    <th className="pb-3 font-semibold text-right sticky right-0">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {liveCampaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.03] transition">
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-white truncate max-w-[240px]">{c.title}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[240px] mt-0.5">{c.id}</div>
                      </td>
                      <td className="hidden py-3.5 pr-4 md:table-cell">
                        <span className="rounded-md bg-slate-800/80 px-2 py-1 text-xs font-semibold text-slate-300 uppercase">{c.targetPublisherId}</span>
                      </td>
                      <td className="hidden py-3.5 pr-4 sm:table-cell">
                        {c.discountPercent ? <span className="font-bold text-emerald-400">-{c.discountPercent}%</span> : '—'}
                      </td>
                      <td className="py-3.5 pr-4">
                        <button
                          onClick={() => handleToggleTopBanner(c.id)}
                          disabled={actionLoading !== null}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50"
                          style={{ backgroundColor: c.isTopBanner ? '#10b981' : '#374151' }}
                        >
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${c.isTopBanner ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="py-3.5 text-right sticky right-0" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <Link href="/game" target="_blank" className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition whitespace-nowrap">
                            Xem trên site
                          </Link>
                          <button
                            onClick={() => apiAction('deactivate', { campaignId: c.id })}
                            disabled={actionLoading !== null}
                            className="rounded-lg bg-rose-600/70 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition disabled:opacity-50 whitespace-nowrap"
                          >
                            Tắt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Applied proposals */}
          {appliedProposals.length > 0 && (
            <div className={liveCampaigns.length > 0 ? 'mt-4 pt-4 border-t border-white/[0.06]' : ''}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Proposals đã duyệt / kích hoạt</h3>
              <CampaignTable
                proposals={appliedProposals}
                onSelect={setSelectedProposal}
                selectedId={selectedProposal?.id}
                actions={(p) => (
                  <>
                    {p.status === 'approved' && (
                      <button onClick={() => apiAction('apply', { proposalId: p.id })} disabled={actionLoading !== null}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition disabled:opacity-50 whitespace-nowrap">
                        Áp dụng
                      </button>
                    )}
                  </>
                )}
              />
            </div>
          )}

          {liveCampaigns.length === 0 && appliedProposals.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-500">Chưa có chiến dịch nào đang chạy.</div>
          )}
        </Section>

        {/* ═══ Section 3: Draft & Từ chối ═══ */}
        <Section title="Draft & Từ chối" icon="📝" count={draftAndRejected.length} defaultOpen={draftAndRejected.length > 0} accentColor="amber">
          <CampaignTable
            proposals={draftAndRejected}
            onSelect={setSelectedProposal}
            selectedId={selectedProposal?.id}
            actions={(p) => (
              <>
                {p.status === 'draft' && (
                  <>
                    <button onClick={() => apiAction('approve', { proposalId: p.id })} disabled={actionLoading !== null}
                      className="rounded-lg bg-blue-600/80 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600 transition disabled:opacity-50 whitespace-nowrap">
                      Duyệt
                    </button>
                    <button onClick={() => apiAction('reject', { proposalId: p.id })} disabled={actionLoading !== null}
                      className="rounded-lg bg-rose-600/70 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition disabled:opacity-50 whitespace-nowrap">
                      Từ chối
                    </button>
                  </>
                )}
                {p.status === 'rejected' && (
                  <button onClick={() => apiAction('revert', { proposalId: p.id })} disabled={actionLoading !== null}
                    className="rounded-lg bg-amber-600/80 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition disabled:opacity-50 whitespace-nowrap">
                    Khôi phục Draft
                  </button>
                )}
              </>
            )}
          />
        </Section>

        {/* ═══ Section 4: Đã tắt ═══ */}
        {disabledCampaigns.length > 0 && (
          <Section title="Đã tắt" icon="⛔" count={disabledCampaigns.length} defaultOpen={false} accentColor="blue">
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">Chiến dịch</th>
                    <th className="hidden pb-3 pr-4 font-semibold md:table-cell">Publisher</th>
                    <th className="hidden pb-3 pr-4 font-semibold sm:table-cell">Giảm giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {disabledCampaigns.map((c) => (
                    <tr key={c.id} className="opacity-50">
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-white truncate max-w-[240px]">{c.title}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[240px] mt-0.5">{c.id}</div>
                      </td>
                      <td className="hidden py-3.5 pr-4 md:table-cell">
                        <span className="rounded-md bg-slate-800/80 px-2 py-1 text-xs font-semibold text-slate-300 uppercase">{c.targetPublisherId}</span>
                      </td>
                      <td className="hidden py-3.5 pr-4 sm:table-cell">
                        {c.discountPercent ? <span className="font-bold text-slate-400">-{c.discountPercent}%</span> : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ═══ Slide-in Drawer ═══ */}
        {selectedProposal && (
          <Drawer
            proposal={selectedProposal}
            onClose={() => setSelectedProposal(null)}
            editFields={editFields}
            setEditFields={setEditFields}
            onSave={handleSaveEdits}
            onAction={handleDrawerAction}
            actionLoading={actionLoading}
          />
        )}
      </div>
    </div>
  )
}
