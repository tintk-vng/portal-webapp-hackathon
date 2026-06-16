#!/usr/bin/env node
/**
 * enrichArticleContent.js
 *
 * Fetches real promotional content from official publisher websites and updates
 * a proposal's articleContent with real, useful information.
 *
 * Usage: node scripts/enrichArticleContent.js <proposalId>
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const root = path.resolve(__dirname, '..')
const proposalDir = path.join(root, 'src', 'agent', 'proposals')
const researchSourcesPath = path.join(root, 'src', 'agent', 'inputs', 'publisherResearchSources.json')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function fetchUrl(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.get(url, { headers: { 'User-Agent': 'NapTheVui-ContentBot/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, timeoutMs).then(resolve).catch(reject)
      }
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => resolve(body))
    })
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)) })
    req.on('error', reject)
  })
}

function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function stripHtml(html) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
  )
}

function extractTextBlocks(html, keywords) {
  const blocks = []
  const tagPattern = /<(h[1-4]|p|li)[^>]*>([\s\S]*?)<\/\1>/gi
  let match
  while ((match = tagPattern.exec(html)) !== null) {
    const text = stripHtml(match[2]).trim()
    if (text.length < 20) continue
    const lower = text.toLowerCase()
    const relevant = keywords.some(kw => lower.includes(kw.toLowerCase()))
    if (relevant) blocks.push({ tag: match[1], text })
    if (blocks.length >= 15) break
  }
  return blocks
}

function buildArticleHtml(proposal, blocks, sourceUrl) {
  const discount = proposal.discountPercent ? `${proposal.discountPercent}%` : ''
  const publisher = (proposal.targetPublisherId || '').toUpperCase()
  const games = (proposal.targetGameIds || []).join(', ')

  const blockHtml = blocks.length > 0
    ? blocks.map(b => {
        if (b.tag.startsWith('h')) return `<h4>${b.text}</h4>`
        return `<p>${b.text}</p>`
      }).join('\n')
    : `<p>Cập nhật ưu đãi mới nhất từ trang chính thức ${publisher} tại <a href="${sourceUrl}" target="_blank" rel="noopener">${sourceUrl}</a>.</p>`

  return `<h3>Ưu Đãi Nạp ${publisher}${discount ? ` Giảm ${discount}` : ''}</h3>
<p><strong>Áp dụng cho:</strong> ${games || publisher}.</p>
<p><strong>Mức ưu đãi:</strong> ${discount ? `Giảm ${discount}` : 'Xem chi tiết tại trang nạp'} khi nạp qua NapTheVui.</p>

<h4>Nội dung từ nhà phát hành chính thức:</h4>
${blockHtml}

<h4>Hướng dẫn nạp và nhận ưu đãi:</h4>
<ol>
<li>Tìm kiếm <strong>${publisher}</strong> hoặc tên tựa game trong ô tìm kiếm NapTheVui.</li>
<li>Chọn mệnh giá thẻ nạp phù hợp.</li>
<li>Kiểm tra chiết khấu hiển thị tại màn hình thanh toán trước khi xác nhận.</li>
</ol>

<p><em>Nguồn: <a href="${sourceUrl}" target="_blank" rel="noopener">${sourceUrl}</a>. Nội dung được tổng hợp tự động — kiểm tra và xác nhận trước khi xuất bản.</em></p>`
}

async function enrichProposal(proposalId) {
  const proposalPath = path.join(proposalDir, `${proposalId}.json`)
  if (!fs.existsSync(proposalPath)) {
    console.error(`Proposal not found: ${proposalPath}`)
    process.exit(1)
  }

  const proposal = readJson(proposalPath)
  const sources = readJson(researchSourcesPath)

  const source = sources.sources.find(
    s => s.publisherId === proposal.targetPublisherId && s.enabled
  )

  if (!source) {
    console.log(`No research source found for publisher: ${proposal.targetPublisherId}`)
    proposal.articleContent = buildArticleHtml(proposal, [], proposal.targetPublisherId || '')
    writeJson(proposalPath, proposal)
    return
  }

  console.log(`Fetching content from: ${source.url}`)
  let html = ''
  try {
    html = await fetchUrl(source.url)
    console.log(`Fetched ${html.length} bytes from ${source.url}`)
  } catch (err) {
    console.warn(`Failed to fetch ${source.url}: ${err.message}`)
  }

  const blocks = html ? extractTextBlocks(html, source.keywords) : []
  console.log(`Extracted ${blocks.length} relevant text blocks`)

  proposal.articleContent = buildArticleHtml(proposal, blocks, source.url)
  writeJson(proposalPath, proposal)
  console.log(`Updated articleContent for proposal: ${proposalId}`)
}

const proposalId = process.argv[2]
if (!proposalId) {
  console.error('Usage: node scripts/enrichArticleContent.js <proposalId>')
  process.exit(1)
}

enrichProposal(proposalId).catch(err => {
  console.error(err)
  process.exit(1)
})
