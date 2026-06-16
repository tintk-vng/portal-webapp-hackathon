const fs = require('fs')
const path = require('path')
const Module = require('module')
const ts = require('typescript')

const root = path.resolve(__dirname, '..')
const defaultBriefPath = path.join(root, 'src', 'agent', 'inputs', 'weeklyBrief.md')
const defaultAnalyticsPath = path.join(root, 'src', 'agent', 'inputs', 'mockAnalytics.json')
const defaultSignalsPath = path.join(root, 'src', 'agent', 'inputs', 'publisherPromoSignals.json')
const defaultGeneratedSignalsPath = path.join(root, 'src', 'agent', 'outputs', 'publisherPromoSignals.generated.json')
const defaultResearchSourcesPath = path.join(root, 'src', 'agent', 'inputs', 'publisherResearchSources.json')
const proposalDir = path.join(root, 'src', 'agent', 'proposals')

function registerTypeScriptRuntime() {
  const originalResolveFilename = Module._resolveFilename

  Module._resolveFilename = function resolveWithAlias(request, parent, isMain, options) {
    if (request.startsWith('@/')) {
      return originalResolveFilename.call(this, path.join(root, request.slice(2)), parent, isMain, options)
    }

    return originalResolveFilename.call(this, request, parent, isMain, options)
  }

  require.extensions['.ts'] = function compileTypeScript(module, filename) {
    const source = fs.readFileSync(filename, 'utf8')
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2019,
        esModuleInterop: true,
        resolveJsonModule: true
      }
    })

    module._compile(output.outputText, filename)
  }
}

function readTextIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function parseArgs(argv) {
  const args = {
    briefPath: defaultBriefPath,
    analyticsPath: defaultAnalyticsPath,
    signalsPath: defaultSignalsPath,
    generatedSignalsPath: defaultGeneratedSignalsPath,
    researchSourcesPath: defaultResearchSourcesPath,
    runResearch: false,
    proposalId: undefined
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === '--brief') {
      args.briefPath = path.resolve(root, argv[index + 1])
      index += 1
    } else if (value === '--analytics') {
      args.analyticsPath = path.resolve(root, argv[index + 1])
      index += 1
    } else if (value === '--signals') {
      args.signalsPath = path.resolve(root, argv[index + 1])
      index += 1
    } else if (value === '--generated-signals') {
      args.generatedSignalsPath = path.resolve(root, argv[index + 1])
      index += 1
    } else if (value === '--research-sources') {
      args.researchSourcesPath = path.resolve(root, argv[index + 1])
      index += 1
    } else if (value === '--run-research') {
      args.runResearch = true
    } else if (value === '--id') {
      args.proposalId = argv[index + 1]
      index += 1
    }
  }

  return args
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatDateId(date) {
  return date.toISOString().slice(0, 10)
}

function formatDiscountPercent(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '')
}

function getUniqueProposalId(baseId) {
  let candidate = baseId
  let suffix = 2

  while (fs.existsSync(path.join(proposalDir, `${candidate}.json`))) {
    candidate = `${baseId}-${suffix}`
    suffix += 1
  }

  return candidate
}

function scoreAnalyticsItem(item) {
  return (
    (Number(item.trendScore) || 0) * 120 +
    Math.log((Number(item.searchCount) || 0) + 1) * 300 +
    Math.log((Number(item.clickCount) || 0) + 1) * 180 +
    Math.log((Number(item.purchaseCount) || 0) + 1) * 520
  )
}

function getAnalyticsItems(analytics) {
  return Array.isArray(analytics.items) ? analytics.items : []
}

function getManualPromoSignals(signals) {
  return Array.isArray(signals.signals) ? signals.signals : []
}

function getGeneratedResearchSignals(generatedSignals) {
  return Array.isArray(generatedSignals.signals) ? generatedSignals.signals : []
}

function getBriefTitle(briefText) {
  const firstContentLine = briefText
    .split(/\r?\n/)
    .map((line) => line.replace(/^#+\s*/, '').trim())
    .find((line) => line && !line.startsWith('-'))

  return firstContentLine || 'Weekly campaign brief'
}

function buildCatalogContext(catalog) {
  const items = catalog.topupItems
  const byId = new Map(items.map((item) => [item.id, item]))
  const publishers = items.filter((item) => item.type === 'publisher' || item.type === 'store')
  const games = items.filter((item) => item.type === 'game')

  function getPublisherIdForTarget(targetId) {
    const item = byId.get(targetId)
    if (!item) {
      return undefined
    }
    if (item.type === 'publisher' || item.type === 'store') {
      return item.id
    }
    return item.publisherId
  }

  return { items, byId, publishers, games, getPublisherIdForTarget }
}

function isValidPublisherId(publisherId, catalogContext) {
  const publisher = catalogContext.byId.get(publisherId)
  return publisher && (publisher.type === 'publisher' || publisher.type === 'store')
}

function isPositivePercent(value) {
  return Number.isFinite(value) && value > 0 && value < 100
}

function getManualDiscountPercent(signal) {
  const value = Number(signal.discountPercent)
  return isPositivePercent(value) ? value : undefined
}

function getResearchDiscountPercent(signal) {
  const value = Number(signal.detectedDiscount?.value)
  return isPositivePercent(value) ? value : undefined
}

function getBestDiscount(candidate) {
  const manualDiscount = candidate.manualSignals.map(getManualDiscountPercent).find((value) => value !== undefined)
  if (manualDiscount !== undefined) {
    return { discountPercent: manualDiscount, source: 'manual' }
  }

  const researchDiscount = candidate.researchSignals.map(getResearchDiscountPercent).find((value) => value !== undefined)
  if (researchDiscount !== undefined) {
    return { discountPercent: researchDiscount, source: 'research' }
  }

  return { discountPercent: 0, source: 'missing' }
}

function getBriefBoost(briefText, publisher) {
  const briefNormalized = normalizeText(briefText)
  const tokens = [publisher.id, publisher.displayName, publisher.name, ...(publisher.aliases || [])].map(normalizeText)

  return tokens.some((token) => token && briefNormalized.includes(token)) ? 2200 : 0
}

function getAnalyticsByPublisher(analyticsItems, catalogContext, warnings) {
  const analyticsByPublisher = new Map()

  for (const item of analyticsItems) {
    const publisherId = catalogContext.getPublisherIdForTarget(item.targetId)
    if (!publisherId) {
      warnings.push(`Analytics item ignored because targetId is unknown: ${item.targetId}`)
      continue
    }

    analyticsByPublisher.set(publisherId, (analyticsByPublisher.get(publisherId) || 0) + scoreAnalyticsItem(item))
  }

  return analyticsByPublisher
}

function buildCandidates({ briefText, analyticsItems, manualSignals, researchSignals, catalogContext, activeCampaign, warnings }) {
  const analyticsByPublisher = getAnalyticsByPublisher(analyticsItems, catalogContext, warnings)
  const candidateMap = new Map()

  function getCandidate(publisherId) {
    const publisher = catalogContext.byId.get(publisherId)
    if (!publisher || (publisher.type !== 'publisher' && publisher.type !== 'store')) {
      return undefined
    }

    if (!candidateMap.has(publisherId)) {
      candidateMap.set(publisherId, {
        publisher,
        manualSignals: [],
        researchSignals: [],
        analyticsScore: analyticsByPublisher.get(publisherId) || 0,
        briefScore: getBriefBoost(briefText, publisher)
      })
    }

    return candidateMap.get(publisherId)
  }

  for (const signal of manualSignals) {
    if (!isValidPublisherId(signal.publisherId, catalogContext)) {
      warnings.push(`Manual promo signal ignored because publisherId is unknown: ${signal.publisherId}`)
      continue
    }
    getCandidate(signal.publisherId)?.manualSignals.push(signal)
  }

  for (const signal of researchSignals) {
    if (!isValidPublisherId(signal.publisherId, catalogContext)) {
      warnings.push(`Research signal ignored because publisherId is unknown: ${signal.publisherId}`)
      continue
    }
    getCandidate(signal.publisherId)?.researchSignals.push(signal)
  }

  for (const publisherId of analyticsByPublisher.keys()) {
    getCandidate(publisherId)
  }

  for (const publisher of catalogContext.publishers) {
    if (getBriefBoost(briefText, publisher) > 0) {
      getCandidate(publisher.id)
    }
  }

  const candidates = [...candidateMap.values()].map((candidate) => {
    const manualScore = candidate.manualSignals.reduce((score, signal) => {
      return score + (Number(signal.priority) || 0) * 30 + (getManualDiscountPercent(signal) || 0) * 180
    }, 0)
    const researchScore = candidate.researchSignals.reduce((score, signal) => {
      return (
        score +
        (Number(signal.confidence) || 0) * 3500 +
        (Number(signal.sourcePriority) || 0) * 18 +
        (getResearchDiscountPercent(signal) ? 500 : 0) +
        (Array.isArray(signal.visitedUrls) ? signal.visitedUrls.length * 20 : 0)
      )
    }, 0)
    const activeCampaignPenalty = activeCampaign?.targetPublisherId === candidate.publisher.id ? 250 : 0
    const bothSignalBonus = researchScore > 0 && candidate.analyticsScore > 0 ? 1200 : 0
    const noDiscountPenalty = getBestDiscount(candidate).discountPercent > 0 ? 0 : 900

    return {
      ...candidate,
      manualScore,
      researchScore,
      totalScore: candidate.briefScore + manualScore + researchScore + candidate.analyticsScore + bothSignalBonus - activeCampaignPenalty - noDiscountPenalty
    }
  })

  candidates.sort((a, b) => {
    const aHasDiscount = getBestDiscount(a).discountPercent > 0 ? 1 : 0
    const bHasDiscount = getBestDiscount(b).discountPercent > 0 ? 1 : 0

    if (aHasDiscount !== bHasDiscount) {
      return bHasDiscount - aHasDiscount
    }

    return b.totalScore - a.totalScore
  })
  return candidates
}

function chooseCampaignCandidate(args) {
  const warnings = []
  const candidates = buildCandidates({ ...args, warnings })
  const selected = candidates[0]

  if (!selected?.publisher) {
    throw new Error('Agent could not select a publisher from catalog, promo signals, research, or analytics.')
  }

  if (args.activeCampaign?.targetPublisherId === selected.publisher.id) {
    warnings.push(`Selected publisher ${selected.publisher.id} is already targeted by the current active campaign.`)
  }

  if (getBestDiscount(selected).discountPercent <= 0) {
    warnings.push(`Selected publisher ${selected.publisher.id} does not have a confirmed campaign discount from manual or public research signals.`)
  }

  const alternativesConsidered = candidates.slice(1, 4).map((candidate) => candidate.publisher.id)

  return { selected, candidates, alternativesConsidered, warnings }
}

function filterValidPublisherGameIds(gameIds, selectedPublisherId, catalogContext, warnings, sourceLabel) {
  const validGameIds = []

  for (const gameId of gameIds || []) {
    const item = catalogContext.byId.get(gameId)
    if (item?.type === 'game' && item.publisherId === selectedPublisherId) {
      if (!validGameIds.includes(gameId)) {
        validGameIds.push(gameId)
      }
    } else if (gameId) {
      warnings.push(`${sourceLabel} targetGameId ignored because it is missing or maps to another publisher: ${gameId}`)
    }
  }

  return validGameIds
}

function getTargetGames({ selectedCandidate, analyticsItems, catalogContext, warnings }) {
  const selectedPublisherId = selectedCandidate.publisher.id
  const selectedGameIds = []

  for (const signal of selectedCandidate.manualSignals) {
    selectedGameIds.push(...filterValidPublisherGameIds(signal.targetGameIds, selectedPublisherId, catalogContext, warnings, 'Manual promo signal'))
  }

  for (const signal of selectedCandidate.researchSignals) {
    selectedGameIds.push(...filterValidPublisherGameIds(signal.gameIds, selectedPublisherId, catalogContext, warnings, 'Research signal'))
  }

  const analyticsGameIds = analyticsItems
    .filter((item) => item.targetType === 'game' && catalogContext.getPublisherIdForTarget(item.targetId) === selectedPublisherId)
    .sort((a, b) => scoreAnalyticsItem(b) - scoreAnalyticsItem(a))
    .map((item) => item.targetId)

  selectedGameIds.push(...analyticsGameIds)

  const catalogGameIds = catalogContext.games.filter((game) => game.publisherId === selectedPublisherId).map((game) => game.id)
  selectedGameIds.push(...catalogGameIds)

  const uniqueGameIds = [...new Set(selectedGameIds)]

  if (uniqueGameIds.length === 0) {
    warnings.push(`No target games could be resolved for publisher ${selectedPublisherId}.`)
  }

  return uniqueGameIds.slice(0, 4)
}

function buildPopularSearchItems({ proposalId, targetGameIds, analyticsItems, currentPopularItems, catalogContext, createdAt }) {
  const rankedAnalyticsTargets = analyticsItems
    .filter((item) => catalogContext.byId.has(item.targetId))
    .sort((a, b) => scoreAnalyticsItem(b) - scoreAnalyticsItem(a))
    .map((item) => item.targetId)
  const currentPopularTargets = currentPopularItems
    .filter((item) => catalogContext.byId.has(item.targetId))
    .map((item) => item.targetId)

  const targetIds = []
  for (const id of [...targetGameIds, ...rankedAnalyticsTargets, ...currentPopularTargets]) {
    if (!targetIds.includes(id) && catalogContext.byId.has(id)) {
      const item = catalogContext.byId.get(id)
      if (item.type === 'game' || item.type === 'store') {
        targetIds.push(id)
      }
    }
    if (targetIds.length >= 6) {
      break
    }
  }

  return targetIds.map((targetId, index) => {
    const target = catalogContext.byId.get(targetId)
    const analyticsItem = analyticsItems.find((item) => item.targetId === targetId) || {}
    const currentPopularItem = currentPopularItems.find((item) => item.targetId === targetId) || {}

    return {
      id: `agent-${proposalId}-${targetId}`,
      targetId,
      targetType: target.type,
      label: target.displayName,
      priority: index + 1,
      aiScore: Math.round(scoreAnalyticsItem(analyticsItem) / 100) || Number(currentPopularItem.aiScore) || undefined,
      searchCount: Number(analyticsItem.searchCount) || Number(currentPopularItem.searchCount) || undefined,
      clickCount: Number(analyticsItem.clickCount) || Number(currentPopularItem.clickCount) || undefined,
      purchaseCount: Number(analyticsItem.purchaseCount) || Number(currentPopularItem.purchaseCount) || undefined,
      campaignBoost: targetGameIds.includes(targetId) ? 25 : undefined,
      enabled: true,
      source: 'agent',
      updatedAt: createdAt
    }
  })
}

const PUBLISHER_PREMIUM_IMAGES = {
  garena: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'
  },
  zing: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&w=600&q=80'
  },
  vtc: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80'
  },
  googleplay: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80'
  },
  'roblox-store': {
    bannerImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
  },
  gate: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80'
  },
  scoin: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80'
  },
  sohacoin: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
  },
  funcard: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  gosu: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  appota: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=600&q=80'
  }
}

function getBestResearchSignal(candidate) {
  return [...candidate.researchSignals].sort((a, b) => (Number(b.confidence) || 0) - (Number(a.confidence) || 0))[0]
}

function getBestManualSignal(candidate) {
  return [...candidate.manualSignals].sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0))[0]
}

function buildArticleContent({ publisher, targetGameNames, discountText, discountSource, bestResearchSignal, briefTitle }) {
  const gameText = targetGameNames.length > 0 ? targetGameNames.join(', ') : publisher.displayName
  const sourceLine = bestResearchSignal?.sourceName
    ? `Nguồn tham khảo công khai: ${bestResearchSignal.sourceName} (${bestResearchSignal.sourceUrl}).`
    : 'Nguồn tham khảo công khai: chưa có tín hiệu đủ rõ từ bước research.'
  const discountLine =
    discountSource === 'research'
      ? `Mức ưu đãi ${discountText} được phát hiện từ tín hiệu research công khai và cần được rà soát trong preview trước khi áp dụng.`
      : `Mức ưu đãi ${discountText} được lấy từ campaign setup nội bộ cho bản nháp này.`

  let crawledContentSection = ''
  if (bestResearchSignal && bestResearchSignal.evidenceSnippet && bestResearchSignal.evidenceSnippet.trim().length > 10) {
    crawledContentSection = `<p><strong>Thông tin khuyến mãi ghi nhận từ đối tác:</strong></p><blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 16px 0; font-style: italic; color: #4b5563;">"${bestResearchSignal.evidenceSnippet || bestResearchSignal.summary}"</blockquote>`
  }

  return [
    `<h3>Ưu Đãi Nạp Thẻ Game ${publisher.displayName} Tuần Này</h3>`,
    `<p>NapTheVui đang chuẩn bị ưu đãi nạp ${publisher.displayName} dành cho người dùng muốn nạp nhanh các tựa game quen thuộc.</p>`,
    `<p><strong>Áp dụng cho:</strong> ${gameText}.</p>`,
    `<p>${discountLine}</p>`,
    `<p>${sourceLine}</p>`,
    crawledContentSection,
    `<h4>Hướng dẫn cách nạp và nhận ưu đãi:</h4>`,
    `<ol>`,
    `<li>Tìm kiếm <strong>${publisher.displayName}</strong> hoặc tên tựa game bạn chơi trong ô tìm kiếm NapTheVui.</li>`,
    `<li>Chọn mệnh giá thẻ nạp phù hợp với nhu cầu.</li>`,
    `<li>Kiểm tra chiết khấu và ưu đãi hiển thị rõ ràng tại màn hình thẻ nạp, mệnh giá và phần thanh toán trước khi tiến hành xác nhận giao dịch.</li>`,
    `</ol>`,
    `<p><strong>Thời gian áp dụng:</strong> Theo lịch trình campaign cụ thể sau khi bản nháp đề xuất này được ban biên tập duyệt và áp dụng chính thức.</p>`,
    `<p><em>Lưu ý: Bài viết này được tạo tự động dựa trên ${briefTitle}. Các chi tiết khuyến mãi cần được xác nhận trong preview và validation trước khi xuất hiện trên website chính thức.</em></p>`
  ].filter(Boolean).join('\n')
}

function buildProposal({
  selectedCandidate,
  targetGameIds,
  analyticsItems,
  currentPopularItems,
  catalogContext,
  briefText,
  briefPath,
  analyticsPath,
  signalsPath,
  generatedSignalsPath,
  proposalId,
  alternativesConsidered
}) {
  const createdAt = new Date().toISOString()
  const publisher = selectedCandidate.publisher
  const bestManualSignal = getBestManualSignal(selectedCandidate) || {}
  const bestResearchSignal = getBestResearchSignal(selectedCandidate)
  const { discountPercent, source: discountSource } = getBestDiscount(selectedCandidate)
  const discountText = isPositivePercent(discountPercent) ? `Giảm ${formatDiscountPercent(discountPercent)}%` : 'Ưu đãi đang xác minh'
  const targetGameNames = targetGameIds.map((gameId) => catalogContext.byId.get(gameId)?.displayName || gameId)
  const briefTitle = getBriefTitle(briefText)
  const headlineGameText = targetGameNames.slice(0, 2).join(', ') || publisher.displayName
  const shouldUseProvidedCopy = bestManualSignal.useProvidedCopy === true || bestManualSignal.copyLocked === true
  const bannerTitle = shouldUseProvidedCopy && bestManualSignal.bannerTitle ? bestManualSignal.bannerTitle : `Ưu đãi nạp ${publisher.displayName} trong tuần`
  const bannerSubtitle =
    shouldUseProvidedCopy && bestManualSignal.bannerSubtitle
      ? bestManualSignal.bannerSubtitle
      : `${discountText} cho ${headlineGameText} trên NapTheVui.`
  const ctaText = shouldUseProvidedCopy && bestManualSignal.ctaText ? bestManualSignal.ctaText : 'Xem ưu đãi'
  const articleTitle =
    shouldUseProvidedCopy && bestManualSignal.articleTitle
      ? bestManualSignal.articleTitle
      : `${publisher.displayName}: ưu đãi nạp thẻ tuần này trên NapTheVui`
  const articleSummary =
    shouldUseProvidedCopy && bestManualSignal.articleSummary
      ? bestManualSignal.articleSummary
      : `${discountText} cho nhóm nạp ${publisher.displayName}, tập trung vào ${targetGameNames.slice(0, 3).join(', ') || 'các mệnh giá đủ điều kiện'}.`
  const articleContent =
    (shouldUseProvidedCopy && bestManualSignal.articleContent) ||
    buildArticleContent({
      publisher,
      targetGameNames,
      discountText,
      discountSource,
      bestResearchSignal,
      briefTitle
    })

  const crawledImageUrl = bestResearchSignal?.detectedImageUrl || null
  const defaultImages = PUBLISHER_PREMIUM_IMAGES[publisher.id] || { bannerImageUrl: publisher.logoUrl, coverImageUrl: publisher.logoUrl }
  const bannerImageUrl = bestManualSignal.bannerImageUrl || crawledImageUrl || defaultImages.bannerImageUrl
  const coverImageUrl = bestManualSignal.coverImageUrl || crawledImageUrl || defaultImages.coverImageUrl
  const mobileBannerImageUrl = bestManualSignal.mobileBannerImageUrl || bannerImageUrl

  return {
    id: proposalId,
    title: `${publisher.displayName} weekly campaign proposal`,
    selectedPublisher: publisher.id,
    alternativesConsidered,
    targetPublisherId: publisher.id,
    targetGameIds,
    discountPercent,
    discountText,
    bannerTitle,
    bannerSubtitle,
    bannerImageUrl,
    mobileBannerImageUrl,
    coverImageUrl,
    ctaText,
    altText: `${publisher.displayName} promotion banner`,
    imagePrompt: [
      `Consumer promotion banner for ${publisher.displayName} on NapTheVui.`,
      `Focus games: ${targetGameNames.join(', ') || publisher.displayName}.`,
      `Message: ${discountText}.`,
      'Clean fintech checkout style, Vietnamese market, polished but not cluttered.'
    ].join(' '),
    articleTitle,
    articleSummary,
    articleContent,
    recommendedPopularSearchItems: buildPopularSearchItems({
      proposalId,
      targetGameIds,
      analyticsItems,
      currentPopularItems,
      catalogContext,
      createdAt
    }),
    proposedFileChanges: ['src/data/campaigns.ts', 'src/data/newsArticles.ts', 'src/data/catalog.ts'],
    createdAt,
    status: 'scanned',
    lastScannedAt: createdAt,
    statusHistory: [{ status: 'scanned', timestamp: createdAt }],
    researchSourceIds: selectedCandidate.researchSignals.map((signal) => signal.id),
    researchVisitedUrls: [...new Set(selectedCandidate.researchSignals.flatMap((signal) => signal.visitedUrls || []))],
    reasoningSummary: [
      `${publisher.displayName} was selected for one single-publisher campaign.`,
      `Score inputs: research=${Math.round(selectedCandidate.researchScore)}, manual=${Math.round(selectedCandidate.manualScore)}, demand=${Math.round(selectedCandidate.analyticsScore)}, brief=${Math.round(selectedCandidate.briefScore)}.`,
      `Discount source: ${discountSource}.`,
      `Top target games: ${targetGameNames.join(', ') || 'none'}.`,
      alternativesConsidered.length > 0
        ? `Alternatives considered: ${alternativesConsidered.join(', ')}.`
        : 'No strong alternatives were available from the configured inputs.',
      bestResearchSignal
        ? `Best research signal: ${bestResearchSignal.sourceName}, confidence ${bestResearchSignal.confidence}.`
        : 'No generated public research signal was available for the selected publisher.',
      'No live campaign data was edited. This proposal is draft-only.'
    ].join('\n'),
    validationWarnings: [],
    inputSnapshot: {
      weeklyBriefPath: path.relative(root, briefPath),
      analyticsPath: path.relative(root, analyticsPath),
      publisherPromoSignalsPath: path.relative(root, signalsPath),
      generatedPromoSignalsPath: path.relative(root, generatedSignalsPath),
      generatedBy: 'Campaign & Merchandising Agent v1A'
    }
  }
}

async function maybeRunResearch(options) {
  if (!options.runResearch) {
    return undefined
  }

  const { researchPublisherPromos } = require('./researchPublisherPromos')
  return researchPublisherPromos({
    sourcesPath: options.researchSourcesPath,
    outputPath: options.generatedSignalsPath
  })
}

async function generateWeeklyCampaignProposal(options) {
  registerTypeScriptRuntime()

  await maybeRunResearch(options)

  const catalog = require(path.join(root, 'src', 'data', 'catalog.ts'))
  const campaigns = require(path.join(root, 'src', 'data', 'campaigns.ts'))
  const proposalRepository = require(path.join(root, 'src', 'agent', 'proposalRepository.ts'))

  const briefText = readTextIfExists(options.briefPath)
  const analytics = readJsonIfExists(options.analyticsPath, { items: [] })
  const manualPromoSignals = readJsonIfExists(options.signalsPath, { signals: [] })
  const generatedPromoSignals = readJsonIfExists(options.generatedSignalsPath, { signals: [] })
  const analyticsItems = getAnalyticsItems(analytics)
  const currentPopularItems =
    typeof catalog.getPopularSearchItems === 'function' ? catalog.getPopularSearchItems() : []
  const manualSignals = getManualPromoSignals(manualPromoSignals)
  const researchSignals = getGeneratedResearchSignals(generatedPromoSignals)
  const warnings = []

  if (!briefText.trim()) {
    warnings.push(`Weekly brief is missing or empty: ${options.briefPath}`)
  }
  if (analyticsItems.length === 0) {
    warnings.push(`Analytics input is missing or empty: ${options.analyticsPath}`)
  }
  if (manualSignals.length === 0) {
    warnings.push(`Manual publisher promo signals input is missing or empty: ${options.signalsPath}`)
  }
  if (researchSignals.length === 0) {
    warnings.push(`Generated public research signals are missing or empty: ${options.generatedSignalsPath}`)
  }

  for (const signal of researchSignals) {
    for (const warning of signal.warnings || []) {
      warnings.push(`Research ${signal.publisherId}: ${warning}`)
    }
  }

  const catalogContext = buildCatalogContext(catalog)
  const activeCampaign = campaigns.getActiveCampaign()
  const selection = chooseCampaignCandidate({
    briefText,
    analyticsItems,
    manualSignals,
    researchSignals,
    catalogContext,
    activeCampaign
  })

  warnings.push(...selection.warnings)

  const targetGameIds = getTargetGames({
    selectedCandidate: selection.selected,
    analyticsItems,
    catalogContext,
    warnings
  })

  const dateId = formatDateId(new Date())
  const baseProposalId = options.proposalId || `weekly-${slugify(selection.selected.publisher.id)}-${dateId}`
  const proposalId = options.proposalId || getUniqueProposalId(baseProposalId)
  if (!/^[a-z0-9][a-z0-9-]*$/.test(proposalId)) {
    throw new Error(`Proposal id must use lowercase letters, numbers, and hyphens only: ${proposalId}`)
  }
  if (options.proposalId && fs.existsSync(path.join(proposalDir, `${proposalId}.json`))) {
    throw new Error(`Proposal already exists: ${proposalId}. Choose a different --id to avoid overwriting a draft.`)
  }

  const proposal = buildProposal({
    selectedCandidate: selection.selected,
    targetGameIds,
    analyticsItems,
    currentPopularItems,
    catalogContext,
    briefText,
    briefPath: options.briefPath,
    analyticsPath: options.analyticsPath,
    signalsPath: options.signalsPath,
    generatedSignalsPath: options.generatedSignalsPath,
    proposalId,
    alternativesConsidered: selection.alternativesConsidered
  })

  const validationWarnings = proposalRepository.validateCampaignProposal(proposal)
  proposal.validationWarnings = [...warnings, ...validationWarnings]

  fs.mkdirSync(proposalDir, { recursive: true })
  const proposalPath = path.join(proposalDir, `${proposal.id}.json`)
  fs.writeFileSync(proposalPath, `${JSON.stringify(proposal, null, 2)}\n`, 'utf8')

  return {
    proposal,
    proposalPath,
    researchSummary: {
      sourcesResearched: researchSignals.length,
      urlsVisited: researchSignals.reduce((count, signal) => count + (signal.visitedUrls || []).length, 0),
      sourcesSucceeded: researchSignals.filter((signal) => (signal.visitedUrls || []).length > 0).length,
      sourcesFailed: researchSignals.filter((signal) => (signal.visitedUrls || []).length === 0).length,
      promotionSignalsFound: researchSignals.filter((signal) => Number(signal.confidence) >= 0.5 || signal.detectedDiscount).length
    },
    selectedCandidate: selection.selected,
    alternativesConsidered: selection.alternativesConsidered
  }
}

if (require.main === module) {
  generateWeeklyCampaignProposal(parseArgs(process.argv.slice(2)))
    .then(({ proposal, proposalPath, researchSummary, selectedCandidate, alternativesConsidered }) => {
      console.log(`Sources researched: ${researchSummary.sourcesResearched}`)
      console.log(`URLs visited: ${researchSummary.urlsVisited}`)
      console.log(`Sources succeeded: ${researchSummary.sourcesSucceeded}`)
      console.log(`Sources failed: ${researchSummary.sourcesFailed}`)
      console.log(`Promotion signals found: ${researchSummary.promotionSignalsFound}`)
      console.log(`Selected publisher: ${proposal.targetPublisherId}`)
      console.log(`Alternatives considered: ${alternativesConsidered.length > 0 ? alternativesConsidered.join(', ') : '(none)'}`)
      console.log(`Why recommended: ${proposal.reasoningSummary.split('\n')[0]}`)
      console.log(`Generated draft proposal: ${proposal.id}`)
      console.log(`Saved to: ${path.relative(root, proposalPath)}`)
      console.log(`Preview URL: http://localhost:8090/agent-preview/${proposal.id}`)
      if (proposal.validationWarnings.length > 0) {
        console.log('Warnings:')
        for (const warning of proposal.validationWarnings) {
          console.log(`- ${warning}`)
        }
      }
      console.log(
        `Score detail: research=${Math.round(selectedCandidate.researchScore)}, manual=${Math.round(selectedCandidate.manualScore)}, demand=${Math.round(selectedCandidate.analyticsScore)}, brief=${Math.round(selectedCandidate.briefScore)}`
      )
    })
    .catch((error) => {
      console.error(error.message)
      process.exit(1)
    })
}

module.exports = {
  generateWeeklyCampaignProposal
}
