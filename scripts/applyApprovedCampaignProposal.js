const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const { runNextBuild } = require('./runNextBuild')

const root = path.resolve(__dirname, '..')
const proposalDir = path.join(root, 'src', 'agent', 'proposals')
const campaignsPath = path.join(root, 'src', 'data', 'campaigns.ts')
const newsArticlesPath = path.join(root, 'src', 'data', 'newsArticles.ts')
const catalogPath = path.join(root, 'src', 'data', 'catalog.ts')
const localServerPidPath = path.join(root, 'dev-server.pid')
const defaultLocalPort = process.env.NAPTHEVUI_LOCAL_PORT || '8090'

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
}

function formatDiscountPercent(value) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/\.?0+$/, '')
}

function isPlainIdentifier(value) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)
}

function tsValue(value, indent = 0) {
  const pad = ' '.repeat(indent)
  const childPad = ' '.repeat(indent + 2)

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]'
    }

    return `[\n${value.map((item) => `${childPad}${tsValue(item, indent + 2)}`).join(',\n')}\n${pad}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)

    if (entries.length === 0) {
      return '{}'
    }

    return `{\n${entries
      .map(([key, entryValue]) => `${childPad}${isPlainIdentifier(key) ? key : JSON.stringify(key)}: ${tsValue(entryValue, indent + 2)}`)
      .join(',\n')}\n${pad}}`
  }

  return JSON.stringify(value)
}

function findExportedArray(source, arrayName) {
  const exportIndex = source.indexOf(`export const ${arrayName}`)

  if (exportIndex === -1) {
    throw new Error(`Could not find exported array ${arrayName}`)
  }

  const assignmentIndex = source.indexOf('=', exportIndex)
  if (assignmentIndex === -1) {
    throw new Error(`Could not find assignment for exported array ${arrayName}`)
  }

  const start = source.indexOf('[', assignmentIndex)
  if (start === -1) {
    throw new Error(`Could not find start of array ${arrayName}`)
  }

  let depth = 0
  let inString = false
  let quote = ''
  let escaped = false

  for (let index = start; index < source.length; index += 1) {
    const char = source[index]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        inString = false
      }
      continue
    }

    if (char === "'" || char === '"' || char === '`') {
      inString = true
      quote = char
      continue
    }

    if (char === '[') {
      depth += 1
    } else if (char === ']') {
      depth -= 1
      if (depth === 0) {
        return {
          start,
          end: index,
          content: source.slice(start + 1, index)
        }
      }
    }
  }

  throw new Error(`Could not find end of array ${arrayName}`)
}

function findObjectSpans(arrayContent) {
  const spans = []
  let depth = 0
  let start = -1
  let inString = false
  let quote = ''
  let escaped = false

  for (let index = 0; index < arrayContent.length; index += 1) {
    const char = arrayContent[index]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        inString = false
      }
      continue
    }

    if (char === "'" || char === '"' || char === '`') {
      inString = true
      quote = char
      continue
    }

    if (char === '{') {
      if (depth === 0) {
        start = index
      }
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0 && start !== -1) {
        spans.push({ start, end: index + 1, text: arrayContent.slice(start, index + 1) })
        start = -1
      }
    }
  }

  return spans
}

function upsertObjectInExportedArray(source, arrayName, id, objectValue) {
  const range = findExportedArray(source, arrayName)
  const objectText = tsValue(objectValue, 2)
  const spans = findObjectSpans(range.content)
  const existing = spans.find((span) => new RegExp(`id:\\s*['"\`]${id}['"\`]`).test(span.text))

  let nextContent
  if (existing) {
    nextContent = `${range.content.slice(0, existing.start)}${objectText}${range.content.slice(existing.end)}`
  } else {
    const trimmed = range.content.trim()
    nextContent = trimmed ? `\n${trimmed},\n  ${objectText.trim()}\n` : `\n  ${objectText.trim()}\n`
  }

  return `${source.slice(0, range.start + 1)}${nextContent}${source.slice(range.end)}`
}

function replaceExportedArray(source, arrayName, values) {
  const range = findExportedArray(source, arrayName)
  const arrayText = values.length ? `\n${values.map((value) => `  ${tsValue(value, 2).trim()}`).join(',\n')}\n` : ''
  return `${source.slice(0, range.start + 1)}${arrayText}${source.slice(range.end)}`
}

function getTopLevelObjectId(objectText) {
  return objectText.match(/\bid:\s*['"`]([^'"`]+)['"`]/)?.[1]
}

function setTopLevelEnabled(objectText, enabled) {
  const enabledValue = enabled ? 'true' : 'false'
  const enabledLinePattern = /^(\s{4}enabled:\s*)(true|false)(,?)$/m

  if (enabledLinePattern.test(objectText)) {
    return objectText.replace(enabledLinePattern, `$1${enabledValue}$3`)
  }

  const priorityLinePattern = /^(\s{4}priority:\s*)/m
  if (priorityLinePattern.test(objectText)) {
    return objectText.replace(priorityLinePattern, `    enabled: ${enabledValue},\n$1`)
  }

  return objectText.replace(/\n\s*}$/, `\n    enabled: ${enabledValue}\n  }`)
}

function enableOnlyCampaign(source, activeCampaignId) {
  const range = findExportedArray(source, 'campaigns')
  const spans = findObjectSpans(range.content)
  let nextContent = ''
  let cursor = 0

  for (const span of spans) {
    const objectId = getTopLevelObjectId(span.text)

    nextContent += range.content.slice(cursor, span.start)
    nextContent += objectId ? setTopLevelEnabled(span.text, objectId === activeCampaignId) : span.text
    cursor = span.end
  }

  nextContent += range.content.slice(cursor)

  return `${source.slice(0, range.start + 1)}${nextContent}${source.slice(range.end)}`
}

function readProposal(proposalId) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(proposalId)) {
    throw new Error('Proposal ID must be lowercase letters, numbers, and hyphens only.')
  }

  const proposalPath = path.join(proposalDir, `${proposalId}.json`)

  if (!fs.existsSync(proposalPath)) {
    throw new Error(`Proposal not found: ${proposalPath}`)
  }

  return JSON.parse(readText(proposalPath))
}

function markProposalApplied(proposal) {
  const proposalPath = path.join(proposalDir, `${proposal.id}.json`)
  writeText(
    proposalPath,
    `${JSON.stringify(
      {
        ...proposal,
        status: 'applied'
      },
      null,
      2
    )}\n`
  )
}

function parseCatalogIds(catalogSource) {
  const itemTypes = new Map()
  const itemPublisherIds = new Map()
  const itemMatches = catalogSource.matchAll(/\{\s*id:\s*['"`]([^'"`]+)['"`][\s\S]*?type:\s*['"`]([^'"`]+)['"`]/g)
  for (const match of itemMatches) {
    itemTypes.set(match[1], match[2])
  }

  const topupItemsRange = findExportedArray(catalogSource, 'topupItems')
  for (const span of findObjectSpans(topupItemsRange.content)) {
    const id = span.text.match(/\bid:\s*['"`]([^'"`]+)['"`]/)?.[1]
    const publisherId = span.text.match(/\bpublisherId:\s*['"`]([^'"`]+)['"`]/)?.[1]
    if (id && publisherId) {
      itemPublisherIds.set(id, publisherId)
    }
  }

  const skuIds = new Set()
  const skuMatches = catalogSource.matchAll(/\{\s*id:\s*['"`]([^'"`]+)['"`][\s\S]*?publisherId:/g)
  for (const match of skuMatches) {
    skuIds.add(match[1])
  }

  return { itemTypes, itemPublisherIds, skuIds }
}

function normalizeNumericFields(proposal) {
  if (proposal.discountPercent != null) {
    proposal.discountPercent = Number(proposal.discountPercent)
  }
  return proposal
}

function validateProposal(proposal, catalogSource) {
  normalizeNumericFields(proposal)
  const errors = []
  const { itemTypes, itemPublisherIds, skuIds } = parseCatalogIds(catalogSource)
  const publisherType = itemTypes.get(proposal.targetPublisherId)

  if (proposal.status !== 'approved' && proposal.status !== 'applied') {
    errors.push(`Proposal status must be "approved" or "applied" before applying. Current status: ${proposal.status}`)
  }

  if (typeof proposal.targetPublisherId !== 'string' || Array.isArray(proposal.targetPublisherId)) {
    errors.push('targetPublisherId must be one publisher/store id string')
  }

  if (Array.isArray(proposal.targetPublisherIds) || Array.isArray(proposal.targetPublishers)) {
    errors.push('proposal must not contain multiple publisher targets')
  }

  if (!publisherType || (publisherType !== 'publisher' && publisherType !== 'store')) {
    errors.push(`targetPublisherId is not a real publisher/store: ${proposal.targetPublisherId}`)
  }

  for (const gameId of proposal.targetGameIds || []) {
    if (itemTypes.get(gameId) !== 'game') {
      errors.push(`targetGameIds contains an invalid game id: ${gameId}`)
    } else if (itemPublisherIds.get(gameId) !== proposal.targetPublisherId) {
      errors.push(`targetGameId ${gameId} does not map to selected publisher/store ${proposal.targetPublisherId}`)
    }
  }

  if (!Number.isFinite(proposal.discountPercent) || proposal.discountPercent <= 0 || proposal.discountPercent >= 100) {
    errors.push('discountPercent must be a positive number below 100')
  }

  for (const item of proposal.recommendedPopularSearchItems || []) {
    if (!itemTypes.has(item.targetId)) {
      errors.push(`recommendedPopularSearchItems targetId does not exist: ${item.targetId}`)
    } else if (itemTypes.get(item.targetId) !== item.targetType) {
      errors.push(`recommendedPopularSearchItems targetType mismatch: ${item.targetId}`)
    }
  }

  const proposedSkuRules = [
    {
      publisherId: proposal.targetPublisherId,
      discountPercent: proposal.discountPercent
    }
  ]

  for (const rule of proposedSkuRules) {
    if (rule.skuId && !skuIds.has(rule.skuId)) {
      errors.push(`skuDiscount references a missing skuId: ${rule.skuId}`)
    }
    if (rule.publisherId && !itemTypes.has(rule.publisherId)) {
      errors.push(`skuDiscount references a missing publisherId: ${rule.publisherId}`)
    }
    if (!Number.isFinite(rule.discountPercent) || rule.discountPercent <= 0 || rule.discountPercent >= 100) {
      errors.push('skuDiscount must have a valid discountPercent')
    }
  }

  return errors
}

function getNextCampaignPriority(campaignSource) {
  const range = findExportedArray(campaignSource, 'campaigns')
  const priorities = [...range.content.matchAll(/priority:\s*(\d+)/g)].map((match) => Number(match[1]))
  const maxPriority = priorities.length > 0 ? Math.max(...priorities) : 140

  return Math.max(150, maxPriority + 10)
}

function proposalToCampaign(proposal, priority = 150) {
  return {
    id: proposal.id,
    title: proposal.bannerTitle,
    subtitle: proposal.bannerSubtitle,
    bannerImageUrl: proposal.bannerImageUrl,
    mobileBannerImageUrl: proposal.mobileBannerImageUrl,
    altText: proposal.altText || `${proposal.bannerTitle} banner`,
    targetPublisherId: proposal.targetPublisherId,
    targetGameIds: proposal.targetGameIds,
    discountPercent: proposal.discountPercent,
    discountText: proposal.discountText || `Giảm ${formatDiscountPercent(proposal.discountPercent)}%`,
    skuDiscounts: [
      {
        id: `${proposal.id}-${proposal.targetPublisherId}-eligible-skus`,
        publisherId: proposal.targetPublisherId,
        discountPercent: proposal.discountPercent,
        enabled: true
      }
    ],
    ctaText: proposal.ctaText,
    articleId: proposal.id,
    enabled: true,
    priority,
    isTopBanner: true,
    themeClassName: 'from-[#E75648] via-[#F1865F] to-[#FFD58F]'
  }
}

function proposalToArticle(proposal) {
  return {
    id: proposal.id,
    title: proposal.articleTitle,
    summary: proposal.articleSummary,
    coverImageUrl: proposal.coverImageUrl || proposal.bannerImageUrl,
    content: proposal.articleContent,
    relatedCampaignId: proposal.id,
    relatedPublisherId: proposal.targetPublisherId,
    relatedGameIds: proposal.targetGameIds,
    publishedAt: proposal.createdAt,
    enabled: true
  }
}

function proposalToPopularSearchItems(proposal) {
  return (proposal.recommendedPopularSearchItems || []).map((item, index) => ({
    ...item,
    priority: item.priority || index + 1,
    source: 'agent',
    updatedAt: item.updatedAt || proposal.createdAt
  }))
}

function runBuild() {
  runNextBuild()
}

let typeScriptRequireHookRegistered = false

function registerTypeScriptRequireHook() {
  if (typeScriptRequireHookRegistered) {
    return
  }

  const ts = require('typescript')
  require.extensions['.ts'] = (module, filename) => {
    const source = readText(filename)
    const output = ts.transpileModule(source, {
      compilerOptions: {
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020
      },
      fileName: filename
    }).outputText

    module._compile(output, filename)
  }

  typeScriptRequireHookRegistered = true
}

function clearModuleCache(filePath) {
  try {
    delete require.cache[require.resolve(filePath)]
  } catch {
    // The module has not been loaded in this process yet.
  }
}

function getCampaignActivationSummary(proposalId) {
  registerTypeScriptRequireHook()
  clearModuleCache(catalogPath)
  clearModuleCache(campaignsPath)

  const campaignModule = require(campaignsPath)
  const appliedCampaign = campaignModule.campaigns.find((campaign) => campaign.id === proposalId)
  const activeCampaign = campaignModule.getActiveCampaign()

  if (!appliedCampaign) {
    throw new Error(`Applied campaign was not written to src/data/campaigns.ts: ${proposalId}`)
  }

  return {
    appliedCampaignId: appliedCampaign.id,
    enabled: appliedCampaign.enabled,
    priority: appliedCampaign.priority,
    validFrom: appliedCampaign.validFrom || '(none)',
    validTo: appliedCampaign.validTo || '(none)',
    selectedActiveCampaignId: activeCampaign?.id || '(none)'
  }
}

function assertAppliedCampaignIsActive(summary, proposalId) {
  if (!summary.enabled) {
    throw new Error(`Applied campaign ${proposalId} is not enabled.`)
  }

  if (summary.selectedActiveCampaignId !== proposalId) {
    throw new Error(
      `Applied campaign ${proposalId} is not the selected active campaign. getActiveCampaign() selected ${summary.selectedActiveCampaignId}.`
    )
  }
}

function wait(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
}

function readLocalServerPid() {
  if (!fs.existsSync(localServerPidPath)) {
    return undefined
  }

  const pid = Number(readText(localServerPidPath).trim())
  return Number.isInteger(pid) && pid > 0 ? pid : undefined
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

function stopLocalServerFromPidFile() {
  const pid = readLocalServerPid()
  if (!pid || pid === process.pid || !isProcessRunning(pid)) {
    return []
  }

  process.kill(pid, 'SIGTERM')
  wait(1500)

  if (isProcessRunning(pid)) {
    process.kill(pid, 'SIGKILL')
    wait(1000)
  }

  return [pid]
}

function restartLocalServer(port = defaultLocalPort) {
  if (process.env.SKIP_LOCAL_SERVER_RESTART === '1') {
    return { skipped: true, reason: 'SKIP_LOCAL_SERVER_RESTART=1' }
  }

  const stoppedPids = stopLocalServerFromPidFile()

  const child = spawn(process.execPath, [path.join(root, 'scripts', 'start-dev-detached.js'), port], {
    cwd: root,
    detached: true,
    env: {
      ...process.env,
      NEXT_DIST_DIR: process.env.NEXT_DIST_DIR || 'next-build-temp'
    },
    stdio: 'ignore',
    windowsHide: true
  })
  child.unref()

  wait(3500)
  const serverPid = readLocalServerPid()

  return {
    skipped: false,
    port,
    stoppedPids,
    startedPid: child.pid,
    serverPid,
    serverPidIsRunning: serverPid ? isProcessRunning(serverPid) : false
  }
}

function applyApprovedCampaignProposal(proposalId) {
  const proposal = readProposal(proposalId)
  const originalCampaigns = readText(campaignsPath)
  const originalNewsArticles = readText(newsArticlesPath)
  const originalCatalog = readText(catalogPath)
  const validationErrors = validateProposal(proposal, originalCatalog)

  if (validationErrors.length > 0) {
    throw new Error(`Proposal validation failed:\n- ${validationErrors.join('\n- ')}`)
  }

  const appliedCampaign = proposalToCampaign(proposal, getNextCampaignPriority(originalCampaigns))
  const nextCampaignsWithApplied = upsertObjectInExportedArray(
    originalCampaigns,
    'campaigns',
    proposal.id,
    appliedCampaign
  )
  const nextCampaigns = enableOnlyCampaign(nextCampaignsWithApplied, proposal.id)
  const nextNewsArticles = upsertObjectInExportedArray(originalNewsArticles, 'newsArticles', proposal.id, proposalToArticle(proposal))
  const nextCatalog = replaceExportedArray(originalCatalog, 'agentPopularSearchRecommendations', proposalToPopularSearchItems(proposal))

  const campaignStatePath = path.join(root, 'src', 'agent', 'campaignState.json')
  let originalState = null
  if (fs.existsSync(campaignStatePath)) {
    originalState = readText(campaignStatePath)
  }

  writeText(campaignsPath, nextCampaigns)
  writeText(newsArticlesPath, nextNewsArticles)
  writeText(catalogPath, nextCatalog)

  let campaignState = { disabledCampaigns: [], topBannerCampaignId: null }
  try {
    if (originalState) {
      campaignState = JSON.parse(originalState)
    }
  } catch (e) {}
  campaignState.topBannerCampaignId = proposal.id
  campaignState.disabledCampaigns = (campaignState.disabledCampaigns || []).filter((id) => id !== proposal.id)
  writeText(campaignStatePath, JSON.stringify(campaignState, null, 2))

  let activationSummary
  try {
    activationSummary = getCampaignActivationSummary(proposal.id)
    assertAppliedCampaignIsActive(activationSummary, proposal.id)
    runBuild()
  } catch (error) {
    writeText(campaignsPath, originalCampaigns)
    writeText(newsArticlesPath, originalNewsArticles)
    writeText(catalogPath, originalCatalog)
    if (originalState !== null) {
      writeText(campaignStatePath, originalState)
    } else if (fs.existsSync(campaignStatePath)) {
      fs.unlinkSync(campaignStatePath)
    }
    throw new Error(`Apply failed after writing proposal. Original files were restored.\n${error.message}`)
  }

  markProposalApplied(proposal)
  const serverSummary = restartLocalServer()

  console.log(`Applied approved campaign proposal: ${proposal.id}`)
  console.log('Activation check:')
  console.log(`- applied campaign ID: ${activationSummary.appliedCampaignId}`)
  console.log(`- enabled: ${activationSummary.enabled}`)
  console.log(`- priority: ${activationSummary.priority}`)
  console.log(`- validFrom: ${activationSummary.validFrom}`)
  console.log(`- validTo: ${activationSummary.validTo}`)
  console.log(`- selected active campaign ID from getActiveCampaign(): ${activationSummary.selectedActiveCampaignId}`)
  if (serverSummary.skipped) {
    console.log(`Local server restart skipped: ${serverSummary.reason}`)
  } else {
    console.log(`Local server restarted detached on http://localhost:${serverSummary.port}`)
    console.log(`- stopped PID(s): ${serverSummary.stoppedPids.length > 0 ? serverSummary.stoppedPids.join(', ') : '(none)'}`)
    console.log(`- starter PID: ${serverSummary.startedPid}`)
    console.log(`- server PID: ${serverSummary.serverPid || '(not written)'}`)
    console.log(`- server PID running: ${serverSummary.serverPidIsRunning}`)
  }
  console.log('Updated files:')
  console.log('- src/data/campaigns.ts')
  console.log('- src/data/newsArticles.ts')
  console.log('- src/data/catalog.ts')
}

if (require.main === module) {
  const proposalId = process.argv[2]

  if (!proposalId) {
    console.error('Usage: node scripts/applyApprovedCampaignProposal.js <proposalId>')
    process.exit(1)
  }

  try {
    applyApprovedCampaignProposal(proposalId)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = {
  applyApprovedCampaignProposal
}
