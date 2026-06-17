import { campaigns } from './campaigns'

export type NewsArticle = {
  id: string
  title: string
  summary: string
  coverImageUrl?: string
  content: string
  relatedCampaignId?: string
  relatedPublisherId?: string
  relatedGameIds?: string[]
  publishedAt: string
  enabled: boolean
}

// AI_AGENT_EDITABLE: update Tin Tức articles linked to campaigns
export const newsArticles: NewsArticle[] = [
{
    id: 'garena-free-fire-week',
    title: 'Free Fire Anniversary: nap the Garena va nhan them uu dai',
    summary: 'Su kien Free Fire moi dang duoc highlight tren NapTheVui. Chon the Garena de mua nhanh trong cung mot luong.',
    coverImageUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png',
    content:
      'Free Fire Anniversary la chien dich duoc de xuat cho banner dau trang. Nguoi dung co the tim Free Fire, chon Garena, sau do tiep tuc chon menh gia the phu hop de thanh toan.',
    relatedCampaignId: 'garena-free-fire-week',
    relatedPublisherId: 'garena',
    relatedGameIds: ['free-fire'],
    publishedAt: '2026-06-14T09:00:00+07:00',
    enabled: true
  },
  {
    id: 'google-play-guide',
    title: 'Mua ma Google Play nhanh tren NapTheVui',
    summary: 'Huong dan chon Google Play khi can nap game Android hoac mua ung dung tren cua hang.',
    coverImageUrl: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png',
    content:
      'Google Play duoc xem nhu mot store/card rieng. Khi nguoi dung tim Google Play hoac CH Play, website se chon dung card Google Play va dua nguoi dung xuong khu vuc chon menh gia.',
    relatedPublisherId: 'googleplay',
    relatedGameIds: ['google-play-game'],
    publishedAt: '2026-06-13T10:00:00+07:00',
    enabled: true
  },
  {
    id: "weekly-garena-2026-06-14",
    title: "Garena campaign proposal for this week",
    summary: "Draft proposal for Garena, based on the weekly brief, promo signal, and mock analytics inputs.",
    coverImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png",
    content: "Garena campaign proposal for this week.\n\nThis draft was generated from: Weekly campaign brief.\nTarget publisher: Garena.\nTarget games: Free Fire, Liên Quân Mobile, FC Online, Liên Minh Huyền Thoại.\nCampaign discount: 5%.\n\nThe proposal is intentionally draft-only. It should be reviewed in the local preview page, approved by changing status to \"approved\", and then applied through the existing proposal apply script.",
    relatedCampaignId: "weekly-garena-2026-06-14",
    relatedPublisherId: "garena",
    relatedGameIds: [
      "free-fire",
      "lien-quan-mobile",
      "fc-online",
      "lien-minh-huyen-thoai"
    ],
    publishedAt: "2026-06-14T11:29:55.480Z",
    enabled: true
  },
  {
    id: "weekly-googleplay-test-2026-06-14",
    title: "Google Play campaign proposal for this week",
    summary: "Draft proposal for Google Play, generated from the local test promo signal and mock analytics.",
    coverImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png",
    content: "Google Play campaign proposal for this week.\n\nThis draft was generated from: Weekly campaign brief.\nTarget publisher: Google Play.\nTarget games: Google Play, Genshin Impact, Tốc Chiến.\nCampaign discount: 3%.\n\nThe proposal is intentionally draft-only. It should be reviewed in the local preview page, approved by changing status to \"approved\", and then applied through the existing proposal apply script.",
    relatedCampaignId: "weekly-googleplay-test-2026-06-14",
    relatedPublisherId: "googleplay",
    relatedGameIds: [
      "google-play-game",
      "genshin-impact",
      "toc-chien"
    ],
    publishedAt: "2026-06-14T16:28:38.895Z",
    enabled: true
  },
  {
    id: "weekly-vtc-test-2026-06-14",
    title: "VTC campaign proposal for this week",
    summary: "Draft proposal for VTC, generated from the local test promo signal and mock analytics.",
    coverImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/vtc.png",
    content: "VTC campaign proposal for this week.\n\nThis draft was generated from: Weekly campaign brief.\nTarget publisher: VTC.\nTarget games: Audition, Đột Kích.\nCampaign discount: 4%.\n\nThe proposal is intentionally draft-only. It should be reviewed in the local preview page, approved by changing status to \"approved\", and then applied through the existing proposal apply script.",
    relatedCampaignId: "weekly-vtc-test-2026-06-14",
    relatedPublisherId: "vtc",
    relatedGameIds: [
      "audition",
      "dot-kich"
    ],
    publishedAt: "2026-06-14T16:41:21.691Z",
    enabled: true
  },
  {
    id: "weekly-googleplay-clean-slate-2026-06-14",
    title: "Google Play campaign proposal for this week",
    summary: "Draft proposal for Google Play, generated from the local test promo signal and mock analytics.",
    coverImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png",
    content: "Google Play campaign proposal for this week.\n\nThis draft was generated from: Weekly campaign brief.\nTarget publisher: Google Play.\nTarget games: Google Play, Genshin Impact, Tốc Chiến.\nCampaign discount: 3%.\n\nThe proposal is intentionally draft-only. It should be reviewed in the local preview page, approved by changing status to \"approved\", and then applied through the existing proposal apply script.",
    relatedCampaignId: "weekly-googleplay-clean-slate-2026-06-14",
    relatedPublisherId: "googleplay",
    relatedGameIds: [
      "google-play-game",
      "genshin-impact",
      "toc-chien"
    ],
    publishedAt: "2026-06-14T16:59:38.858Z",
    enabled: true
  },
  {
    id: "weekly-googleplay-v1a-2026-06-15",
    title: "Google Play: ưu đãi nạp thẻ tuần này trên NapTheVui",
    summary: "Giảm 3% cho nhóm nạp Google Play, tập trung vào Google Play, Genshin Impact, Tốc Chiến.",
    coverImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/googleplay.png",
    content: "NapTheVui đang chuẩn bị ưu đãi nạp Google Play dành cho người dùng muốn nạp nhanh các tựa game quen thuộc.\n\nÁp dụng cho: Google Play, Genshin Impact, Tốc Chiến.\nMức ưu đãi Giảm 3% được lấy từ campaign setup nội bộ cho bản nháp này.\nNguồn tham khảo công khai: Google Play official site (https://play.google.com).\n\nCách sử dụng:\n1. Tìm Google Play hoặc tên game trong ô tìm kiếm NapTheVui.\n2. Chọn mệnh giá phù hợp.\n3. Kiểm tra ưu đãi hiển thị ở thẻ nạp, mệnh giá và phần thanh toán trước khi xác nhận.\n\nThời gian áp dụng: theo lịch campaign sau khi bản nháp được duyệt và áp dụng.\n\nLưu ý: Bài viết này được tạo từ Weekly campaign brief. Các chi tiết khuyến mãi cần được xác nhận trong preview và validation trước khi xuất hiện trên website chính thức.",
    relatedCampaignId: "weekly-googleplay-v1a-2026-06-15",
    relatedPublisherId: "googleplay",
    relatedGameIds: [
      "google-play-game",
      "genshin-impact",
      "toc-chien"
    ],
    publishedAt: "2026-06-14T17:24:26.535Z",
    enabled: true
  },
  {
    id: "weekly-garena-v1a-2026-06-15",
    title: "Garena: ưu đãi nạp thẻ tuần này trên NapTheVui",
    summary: "Giảm 5% cho nhóm nạp Garena, tập trung vào Free Fire, Liên Quân Mobile, FC Online.",
    coverImageUrl: "https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/digital_card/garena.png",
    content: "NapTheVui đang chuẩn bị ưu đãi nạp Garena dành cho người dùng muốn nạp nhanh các tựa game quen thuộc.\n\nÁp dụng cho: Free Fire, Liên Quân Mobile, FC Online, Liên Minh Huyền Thoại.\nMức ưu đãi Giảm 5% được lấy từ campaign setup nội bộ cho bản nháp này.\nNguồn tham khảo công khai: Garena official top-up site (https://napthe.vn).\n\nCách sử dụng:\n1. Tìm Garena hoặc tên game trong ô tìm kiếm NapTheVui.\n2. Chọn mệnh giá phù hợp.\n3. Kiểm tra ưu đãi hiển thị ở thẻ nạp, mệnh giá và phần thanh toán trước khi xác nhận.\n\nThời gian áp dụng: theo lịch campaign sau khi bản nháp được duyệt và áp dụng.\n\nLưu ý: Bài viết này được tạo từ Weekly campaign brief. Các chi tiết khuyến mãi cần được xác nhận trong preview và validation trước khi xuất hiện trên website chính thức.",
    relatedCampaignId: "weekly-garena-v1a-2026-06-15",
    relatedPublisherId: "garena",
    relatedGameIds: [
      "free-fire",
      "lien-quan-mobile",
      "fc-online",
      "lien-minh-huyen-thoai"
    ],
    publishedAt: "2026-06-14T17:23:00.405Z",
    enabled: true
  },
  {
    id: "weekly-garena-2026-06-16-2",
    title: "Garena: ưu đãi nạp thẻ tuần này trên NapTheVui",
    summary: "Giảm 5% cho nhóm nạp Garena, tập trung vào Free Fire, Liên Quân Mobile, FC Online.",
    coverImageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    content: "<h3>Ưu Đãi Nạp Thẻ Game Garena Tuần Này</h3>\n<p>NapTheVui đang chuẩn bị ưu đãi nạp Garena dành cho người dùng muốn nạp nhanh các tựa game quen thuộc.</p>\n<p><strong>Áp dụng cho:</strong> Free Fire, Liên Quân Mobile, FC Online, Liên Minh Huyền Thoại.</p>\n<p>Mức ưu đãi Giảm 5% được lấy từ campaign setup nội bộ cho bản nháp này.</p>\n<p>Nguồn tham khảo công khai: Garena official top-up site (https://napthe.vn).</p>\n<h4>Hướng dẫn cách nạp và nhận ưu đãi:</h4>\n<ol>\n<li>Tìm kiếm <strong>Garena</strong> hoặc tên tựa game bạn chơi trong ô tìm kiếm NapTheVui.</li>\n<li>Chọn mệnh giá thẻ nạp phù hợp với nhu cầu.</li>\n<li>Kiểm tra chiết khấu và ưu đãi hiển thị rõ ràng tại màn hình thẻ nạp, mệnh giá và phần thanh toán trước khi tiến hành giao dịch.</li>\n</ol>\n<p><strong>Thời gian áp dụng:</strong> Theo lịch trình campaign cụ thể sau khi bản nháp đề xuất này được ban biên tập duyệt và áp dụng chính thức.</p>\n<p><em>Lưu ý: Bài viết này được tạo tự động dựa trên Weekly campaign brief. Các chi tiết khuyến mãi cần được xác nhận trong preview và validation trước khi xuất hiện trên website chính thức.</em></p>",
    relatedCampaignId: "weekly-garena-2026-06-16-2",
    relatedPublisherId: "garena",
    relatedGameIds: [
      "free-fire",
      "lien-quan-mobile",
      "fc-online",
      "lien-minh-huyen-thoai"
    ],
    publishedAt: "2026-06-16T07:48:37.913Z",
    enabled: true
  },
  {
    id: "weekly-garena-2026-06-16-4",
    title: "Garena: ưu đãi nạp thẻ tuần này trên NapTheVui",
    summary: "Giảm 5% cho nhóm nạp Garena, tập trung vào Free Fire, Liên Quân Mobile, FC Online.",
    coverImageUrl: "https://www.facebook.com/tr?id=214992645851330&ev=PageView&noscript=1",
    content: "<h3>Ưu Đãi Nạp Thẻ Game Garena Tuần Này</h3>\n<p>NapTheVui đang chuẩn bị ưu đãi nạp Garena dành cho người dùng muốn nạp nhanh các tựa game quen thuộc.</p>\n<p><strong>Áp dụng cho:</strong> Free Fire, Liên Quân Mobile, FC Online, Liên Minh Huyền Thoại.</p>\n<p>Mức ưu đãi Giảm 5% được lấy từ campaign setup nội bộ cho bản nháp này.</p>\n<p>Nguồn tham khảo công khai: Garena official top-up site (https://napthe.vn).</p>\n<h4>Hướng dẫn cách nạp và nhận ưu đãi:</h4>\n<ol>\n<li>Tìm kiếm <strong>Garena</strong> hoặc tên tựa game bạn chơi trong ô tìm kiếm NapTheVui.</li>\n<li>Chọn mệnh giá thẻ nạp phù hợp với nhu cầu.</li>\n<li>Kiểm tra chiết khấu và ưu đãi hiển thị rõ ràng tại màn hình thẻ nạp, mệnh giá và phần thanh toán trước khi tiến hành xác nhận giao dịch.</li>\n</ol>\n<p><strong>Thời gian áp dụng:</strong> Theo lịch trình campaign cụ thể sau khi bản nháp đề xuất này được ban biên tập duyệt và áp dụng chính thức.</p>\n<p><em>Lưu ý: Bài viết này được tạo tự động dựa trên Weekly campaign brief. Các chi tiết khuyến mãi cần được xác nhận trong preview và validation trước khi xuất hiện trên website chính thức.</em></p>",
    relatedCampaignId: "weekly-garena-2026-06-16-4",
    relatedPublisherId: "garena",
    relatedGameIds: [
      "free-fire",
      "lien-quan-mobile",
      "fc-online",
      "lien-minh-huyen-thoai"
    ],
    publishedAt: "2026-06-16T08:56:52.135Z",
    enabled: true
  },
  {
    id: "weekly-garena-2026-06-16-5",
    title: "Garena: ưu đãi nạp thẻ tuần này trên NapTheVui",
    summary: "Giảm 5% cho nhóm nạp Garena, tập trung vào Free Fire, Liên Quân Mobile, FC Online.",
    coverImageUrl: "https://www.facebook.com/tr?id=214992645851330&ev=PageView&noscript=1",
    content: "<h3>Ưu Đãi Nạp Thẻ Game Garena Tuần Này</h3>\n<p>NapTheVui đang chuẩn bị ưu đãi nạp Garena dành cho người dùng muốn nạp nhanh các tựa game quen thuộc.</p>\n<p><strong>Áp dụng cho:</strong> Free Fire, Liên Quân Mobile, FC Online, Liên Minh Huyền Thoại.</p>\n<p>Mức ưu đãi Giảm 5% được lấy từ campaign setup nội bộ cho bản nháp này.</p>\n<p>Nguồn tham khảo công khai: Garena official top-up site (https://napthe.vn).</p>\n<h4>Hướng dẫn cách nạp và nhận ưu đãi:</h4>\n<ol>\n<li>Tìm kiếm <strong>Garena</strong> hoặc tên tựa game bạn chơi trong ô tìm kiếm NapTheVui.</li>\n<li>Chọn mệnh giá thẻ nạp phù hợp với nhu cầu.</li>\n<li>Kiểm tra chiết khấu và ưu đãi hiển thị rõ ràng tại màn hình thẻ nạp, mệnh giá và phần thanh toán trước khi tiến hành xác nhận giao dịch.</li>\n</ol>\n<p><strong>Thời gian áp dụng:</strong> Theo lịch trình campaign cụ thể sau khi bản nháp đề xuất này được ban biên tập duyệt và áp dụng chính thức.</p>\n<p><em>Lưu ý: Bài viết này được tạo tự động dựa trên Weekly campaign brief. Các chi tiết khuyến mãi cần được xác nhận trong preview và validation trước khi xuất hiện trên website chính thức.</em></p>",
    relatedCampaignId: "weekly-garena-2026-06-16-5",
    relatedPublisherId: "garena",
    relatedGameIds: [
      "free-fire",
      "lien-quan-mobile",
      "fc-online",
      "lien-minh-huyen-thoai"
    ],
    publishedAt: "2026-06-16T10:00:45.939Z",
    enabled: true
  },
  {
    id: "weekly-garena-2026-06-16-6",
    title: "Garena: ưu đãi nạp thẻ tuần này trên NapTheVui",
    summary: "Giảm 5% cho nhóm nạp Garena, tập trung vào Free Fire, Liên Quân Mobile, FC Online.",
    coverImageUrl: "https://www.facebook.com/tr?id=214992645851330&ev=PageView&noscript=1",
    content: "<h3>Hướng Dẫn Nạp Thẻ Game Garena An Toàn &amp; Chính Thức tại Napthe.vn</h3>\n<p>Đối với cộng đồng game thủ chơi các tựa game nổi tiếng như <strong>Free Fire, Liên Quân Mobile, FC Online, hay Liên Minh Huyền Thoại</strong>, trang web <strong>napthe.vn</strong> là cổng nạp thẻ chính thức duy nhất do Garena phát hành để đảm bảo an toàn tuyệt đối cho tài khoản của bạn.</p>\n\n<h4>Các bước nạp thẻ chính thức tại napthe.vn:</h4>\n<ol>\n  <li><strong>Truy cập cổng nạp:</strong> Sử dụng trình duyệt truy cập địa chỉ duy nhất <strong><a href=\"https://napthe.vn\" target=\"_blank\" rel=\"noopener\">https://napthe.vn</a></strong>.</li>\n  <li><strong>Chọn Game &amp; Đăng nhập:</strong> Chọn logo tựa game bạn đang chơi và tiến hành đăng nhập bằng tài khoản Garena hoặc qua Player ID (ID nhân vật).</li>\n  <li><strong>Chọn hình thức nạp &amp; Mệnh giá:</strong> Bạn có thể chọn thanh toán qua Thẻ Garena, Ví ShopeePay, thẻ ngân hàng, hoặc quét mã QR. Sau đó chọn mệnh giá nạp phù hợp.</li>\n  <li><strong>Hoàn tất giao dịch:</strong> Nhập thông tin thẻ cào (mã nạp và số seri) hoặc tiến hành quét mã QR để thanh toán. Kim cương, Quân Huy, hoặc FC sẽ được chuyển trực tiếp vào tài khoản game sau ít phút.</li>\n</ol>\n\n<h4>Mẹo nạp thẻ tiết kiệm và an toàn:</h4>\n<ul>\n  <li><strong>Mua thẻ Garena với chiết khấu tại NapTheVui:</strong> Trước khi nạp thẻ, hãy mua thẻ Garena trực tiếp trên NapTheVui để nhận ngay chiết khấu cực hời (hiện đang có chương trình Giảm 5% dành cho nhóm Garena tuần này).</li>\n  <li><strong>Cảnh giác với các trang web giả mạo:</strong> Garena chỉ có duy nhất trang nạp thẻ <strong>napthe.vn</strong>. Tuyệt đối không nhập thông tin tài khoản hoặc mã thẻ vào các trang web lạ tự xưng là \"nạp lậu\", \"nhân X2 sò\" để phòng tránh lừa đảo và mất tài khoản game.</li>\n</ul>\n\n<p><em>Nguồn tham khảo: <a href=\"https://napthe.vn\" target=\"_blank\" rel=\"noopener\">https://napthe.vn</a>. Nội dung được tổng hợp chính thức cho cổng NapTheVui.</em></p>",
    relatedCampaignId: "weekly-garena-2026-06-16-6",
    relatedPublisherId: "garena",
    relatedGameIds: [
      "free-fire",
      "lien-quan-mobile",
      "fc-online",
      "lien-minh-huyen-thoai"
    ],
    publishedAt: "2026-06-16T14:41:52.305Z",
    enabled: true
  },
  {
    id: "weekly-googleplay-2026-06-16-2",
    title: "Google Play: ưu đãi nạp thẻ tuần này trên NapTheVui",
    summary: "Ưu đãi đang xác minh cho nhóm nạp Google Play, tập trung vào Google Play, Genshin Impact, Tốc Chiến.",
    coverImageUrl: "https://play-lh.googleusercontent.com/pXooT00frDwY1CVPeN_Qiz1R4_UyHqhjdXQgP1-e8bf7VUGtYIly6K0R0p39jeoD80Yu3dPg7hqO4hi4oUVz=s256",
    content: "<h3>Hướng Dẫn Mua &amp; Sử Dụng Mã Thẻ Google Play (CH Play) Nhanh Chóng</h3>\n<p>Mã quà tặng Google Play (Google Play Gift Card) là phương thức tiện lợi nhất để thanh toán các ứng dụng, phim ảnh, sách và nạp vật phẩm trong các tựa game Android phổ biến như <strong>Genshin Impact, Tốc Chiến, Roblox</strong> mà không cần liên kết trực tiếp tài khoản ngân hàng cá nhân.</p>\n\n<h4>Quy trình mua và kích hoạt mã Google Play:</h4>\n<ol>\n  <li><strong>Mua mã thẻ:</strong> Tìm kiếm \"Google Play\" trên ô tìm kiếm của NapTheVui, chọn mệnh giá phù hợp và tiến hành thanh toán để nhận ngay mã nạp thẻ.</li>\n  <li><strong>Nạp mã vào tài khoản:</strong>\n    <ul>\n      <li>Mở ứng dụng <strong>Google Play Store (CH Play)</strong> trên điện thoại Android của bạn.</li>\n      <li>Nhấp vào biểu tượng tài khoản (avatar) ở góc trên bên phải màn hình.</li>\n      <li>Chọn <strong>Thanh toán và gói thuê bao</strong> (Payments &amp; subscriptions) &gt; <strong>Đổi mã quà tặng</strong> (Redeem code).</li>\n      <li>Nhập chính xác mã nạp bạn nhận được từ hệ thống và nhấn <strong>Đổi</strong> (Redeem).</li>\n    </ul>\n  </li>\n  <li><strong>Sử dụng số dư:</strong> Số tiền sẽ ngay lập tức được cộng vào số dư Google Play của bạn, sẵn sàng sử dụng để thanh toán các giao dịch trực tiếp trong game hoặc ứng dụng.</li>\n</ol>\n\n<h4>Lưu ý quan trọng:</h4>\n<ul>\n  <li><strong>Kiểm tra quốc gia tài khoản:</strong> Đảm bảo vùng/quốc gia tài khoản Google Play của bạn trùng khớp với mệnh giá thẻ mua (thông thường là Việt Nam).</li>\n  <li><strong>Khuyến mãi đi kèm:</strong> Đừng bỏ qua các đợt ưu đãi chiết khấu từ NapTheVui (như chương trình Ưu đãi đang xác minh tuần này) để tối ưu chi phí nạp game của bạn.</li>\n</ul>",
    relatedCampaignId: "weekly-googleplay-2026-06-16-2",
    relatedPublisherId: "googleplay",
    relatedGameIds: [
      "google-play-game",
      "genshin-impact",
      "toc-chien"
    ],
    publishedAt: "2026-06-16T19:48:43.460Z",
    enabled: true
  }
]

export function getEnabledArticles() {
  let disabledCampaigns: string[] = []
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs')
      const path = require('path')
      const statePath = path.join(process.cwd(), 'src', 'agent', 'campaignState.json')
      if (fs.existsSync(statePath)) {
        const state = JSON.parse(fs.readFileSync(statePath, 'utf8'))
        disabledCampaigns = state.disabledCampaigns || []
      }
    } catch (e) {
      // ignore
    }
  }

  const activeCampaignIds = campaigns
    .filter((c) => c.enabled && !disabledCampaigns.includes(c.id))
    .map((c) => c.id)

  return newsArticles
    .filter((article) => {
      if (!article.enabled) return false
      if (!article.relatedCampaignId) return false
      return activeCampaignIds.includes(article.relatedCampaignId)
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getArticleById(id: string) {
  return getEnabledArticles().find((article) => article.id === id)
}

export function getArticleForCampaign(campaignId: string) {
  return getEnabledArticles().find((article) => article.relatedCampaignId === campaignId)
}
