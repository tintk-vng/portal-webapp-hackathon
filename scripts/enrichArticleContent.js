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
  const pubId = (proposal.targetPublisherId || '').toLowerCase()
  const discountVal = proposal.discountPercent ? `Giảm ${proposal.discountPercent}%` : 'ưu đãi tốt nhất'
  const gamesList = (proposal.targetGameIds || []).join(', ')
  const publisherName = (proposal.targetPublisherId || '').toUpperCase()

  let blockHtml = ''
  if (blocks.length > 0) {
    blockHtml = `
<h4>Tin tức sự kiện ghi nhận từ đối tác:</h4>
${blocks.map(b => {
  if (b.tag.startsWith('h')) return `<h5>${b.text}</h5>`
  return `<p>${b.text}</p>`
}).join('\n')}
`
  }

  let baseContent = ''
  if (pubId === 'garena') {
    baseContent = `<h3>Hướng Dẫn Nạp Thẻ Game Garena An Toàn &amp; Chính Thức tại Napthe.vn</h3>
<p>Đối với cộng đồng game thủ chơi các tựa game nổi tiếng như <strong>Free Fire, Liên Quân Mobile, FC Online, hay Liên Minh Huyền Thoại</strong>, trang web <strong>napthe.vn</strong> là cổng nạp thẻ chính thức duy nhất do Garena phát hành để đảm bảo an toàn tuyệt đối cho tài khoản của bạn.</p>

<h4>Các bước nạp thẻ chính thức tại napthe.vn:</h4>
<ol>
  <li><strong>Truy cập cổng nạp:</strong> Sử dụng trình duyệt truy cập địa chỉ duy nhất <strong><a href="https://napthe.vn" target="_blank" rel="noopener">https://napthe.vn</a></strong>.</li>
  <li><strong>Chọn Game &amp; Đăng nhập:</strong> Chọn logo tựa game bạn đang chơi và tiến hành đăng nhập bằng tài khoản Garena hoặc qua Player ID (ID nhân vật).</li>
  <li><strong>Chọn hình thức nạp &amp; Mệnh giá:</strong> Bạn có thể chọn thanh toán qua Thẻ Garena, Ví ShopeePay, thẻ ngân hàng, hoặc quét mã QR. Sau đó chọn mệnh giá nạp phù hợp.</li>
  <li><strong>Hoàn tất giao dịch:</strong> Nhập thông tin thẻ cào (mã nạp và số seri) hoặc tiến hành quét mã QR để thanh toán. Kim cương, Quân Huy, hoặc FC sẽ được chuyển trực tiếp vào tài khoản game sau ít phút.</li>
</ol>

<h4>Mẹo nạp thẻ tiết kiệm và an toàn:</h4>
<ul>
  <li><strong>Mua thẻ Garena với chiết khấu tại NapTheVui:</strong> Trước khi nạp thẻ, hãy mua thẻ Garena trực tiếp trên NapTheVui để nhận ngay chiết khấu cực hời (hiện đang có chương trình ${discountVal} dành cho nhóm Garena tuần này).</li>
  <li><strong>Cảnh giác với các trang web giả mạo:</strong> Garena chỉ có duy nhất trang nạp thẻ <strong>napthe.vn</strong>. Tuyệt đối không nhập thông tin tài khoản hoặc mã thẻ vào các trang web lạ tự xưng là "nạp lậu", "nhân X2 sò" để phòng tránh lừa đảo và mất tài khoản game.</li>
</ul>`
  } else if (pubId === 'googleplay') {
    baseContent = `<h3>Hướng Dẫn Mua &amp; Sử Dụng Mã Thẻ Google Play (CH Play) Nhanh Chóng</h3>
<p>Mã quà tặng Google Play (Google Play Gift Card) là phương thức tiện lợi nhất để thanh toán các ứng dụng, phim ảnh, sách và nạp vật phẩm trong các tựa game Android phổ biến như <strong>Genshin Impact, Tốc Chiến, Roblox</strong> mà không cần liên kết trực tiếp tài khoản ngân hàng cá nhân.</p>

<h4>Quy trình mua và kích hoạt mã Google Play:</h4>
<ol>
  <li><strong>Mua mã thẻ:</strong> Tìm kiếm "Google Play" trên ô tìm kiếm của NapTheVui, chọn mệnh giá phù hợp và tiến hành thanh toán để nhận ngay mã nạp thẻ.</li>
  <li><strong>Nạp mã vào tài khoản:</strong>
    <ul>
      <li>Mở ứng dụng <strong>Google Play Store (CH Play)</strong> trên điện thoại Android của bạn.</li>
      <li>Nhấp vào biểu tượng tài khoản (avatar) ở góc trên bên phải màn hình.</li>
      <li>Chọn <strong>Thanh toán và gói thuê bao</strong> (Payments &amp; subscriptions) &gt; <strong>Đổi mã quà tặng</strong> (Redeem code).</li>
      <li>Nhập chính xác mã nạp bạn nhận được từ hệ thống và nhấn <strong>Đổi</strong> (Redeem).</li>
    </ul>
  </li>
  <li><strong>Sử dụng số dư:</strong> Số tiền sẽ ngay lập tức được cộng vào số dư Google Play của bạn, sẵn sàng sử dụng để thanh toán các giao dịch trực tiếp trong game hoặc ứng dụng.</li>
</ol>

<h4>Lưu ý quan trọng:</h4>
<ul>
  <li><strong>Kiểm tra quốc gia tài khoản:</strong> Đảm bảo vùng/quốc gia tài khoản Google Play của bạn trùng khớp với mệnh giá thẻ mua (thông thường là Việt Nam).</li>
  <li><strong>Khuyến mãi đi kèm:</strong> Đừng bỏ qua các đợt ưu đãi chiết khấu từ NapTheVui (như chương trình ${discountVal} tuần này) để tối ưu chi phí nạp game của bạn.</li>
</ul>`
  } else if (pubId === 'zing') {
    baseContent = `<h3>Hướng Dẫn Nạp Zing Xu &amp; Thẻ Zing Cào Chính Hãng Qua ZingPay</h3>
<p>Zing Card (Thẻ Zing) là thẻ game do VNG phát hành, dùng để nạp Zing Xu hoặc trực tiếp đổi vật phẩm trong các tựa game đình đám của nhà phát hành VNG như <strong>Gunny, Võ Lâm Truyền Kỳ, PUBG Mobile VN</strong>.</p>

<h4>Các bước nạp thẻ Zing chính thức:</h4>
<ol>
  <li><strong>Truy cập cổng ZingPay:</strong> Truy cập địa chỉ chính thức <strong><a href="https://pay.zing.vn" target="_blank" rel="noopener">https://pay.zing.vn</a></strong>.</li>
  <li><strong>Chọn game cần nạp:</strong> Nhập tên game hoặc chọn từ danh sách game của VNG.</li>
  <li><strong>Đăng nhập tài khoản:</strong> Đăng nhập bằng tài khoản ZingID, Facebook hoặc ID nhân vật trong game của bạn.</li>
  <li><strong>Chọn gói nạp &amp; Hình thức thanh toán:</strong> Chọn gói vật phẩm cần mua, chọn hình thức thanh toán là <strong>Thẻ Zing cào</strong>. Nhập mã thẻ và số seri để hoàn tất nạp.</li>
</ol>

<h4>Ưu đãi khi nạp qua NapTheVui:</h4>
<ul>
  <li>Nhận mức chiết khấu cực tốt (lên tới ${discountVal} tuần này) khi mua thẻ Zing trực tiếp tại NapTheVui trước khi nạp vào cổng ZingPay.</li>
  <li>Đảm bảo mã thẻ sạch, chính gốc và được bảo mật tuyệt đối 100%.</li>
</ul>`
  } else {
    baseContent = `<h3>Ưu Đãi Mua Thẻ Game ${publisherName} Chiết Khấu Cao Tại NapTheVui</h3>
<p>Nhằm đem lại trải nghiệm nạp game tốt nhất cho game thủ, NapTheVui cung cấp dịch vụ mua mã thẻ ${publisherName} online cực kỳ nhanh chóng và an toàn 24/7. Áp dụng cho các tựa game tiêu biểu: <strong>${gamesList || publisherName}</strong>.</p>

<h4>Quy trình mua thẻ tại NapTheVui:</h4>
<ol>
  <li>Tìm kiếm <strong>${publisherName}</strong> trong ô tìm kiếm của website NapTheVui.</li>
  <li>Chọn mệnh giá thẻ game phù hợp với nhu cầu sử dụng của bạn.</li>
  <li>Xem thông tin chiết khấu và tiến hành thanh toán qua ví ZaloPay hoặc tài khoản ngân hàng. Mã thẻ và số seri sẽ hiển thị ngay lập tức.</li>
</ol>

<h4>Lợi ích vượt trội:</h4>
<ul>
  <li><strong>Chiết khấu hấp dẫn:</strong> Mức ưu đãi cực hời lên tới ${discountVal} theo chương trình tuần này giúp bạn nạp game siêu tiết kiệm.</li>
  <li><strong>Giao dịch an toàn:</strong> 100% thẻ chính hãng, hỗ trợ kỹ thuật nhanh chóng khi gặp sự cố thẻ.</li>
</ul>`
  }

  return `${baseContent}
${blockHtml}
<p><em>Nguồn tham khảo: <a href="${sourceUrl}" target="_blank" rel="noopener">${sourceUrl}</a>. Nội dung được tổng hợp chính thức cho cổng NapTheVui.</em></p>`
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
