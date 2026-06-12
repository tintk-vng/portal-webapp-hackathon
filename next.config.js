/** @type {import('next').NextConfig} */
const getAssetPrefix = () => {
  switch (process.env.APP_ENV) {
    case 'local':
      return undefined
    case 'development':
      return 'https://staticsbqc.zalopay.com.vn/telco/webpayment'
    case 'staging':
      return 'https://scdn.zalopay.com.vn/telco/webpayment'
    case 'production':
      return 'https://scdn.zalopay.com.vn/telco/webpayment'
  }
}

function getZlpTelcoPortalWebappBaseUrl() {
  switch (process.env.APP_ENV) {
    case 'local':
      return 'http://localhost:8080'
    case 'development':
      return 'https://zlpdev-telco-portal-webapp.zalopay.vn'
    case 'staging':
      return 'https://zlpstg-telco-portal-webapp.zalopay.vn'
    case 'production':
      return 'https://zlp-telco-portal-webapp.zalopay.vn'
  }
}

function getInternalZlpWebsiteBaseUrl() {
  switch (process.env.APP_ENV) {
    case 'local':
      return 'https://internal-socialdev.zalopay.vn'
    case 'development':
      return 'https://internal-socialdev.zalopay.vn'
    case 'staging':
      return 'https://internal-socialstg.zalopay.vn'
    case 'production':
      return 'https://cms.zalopay.vn'
  }
}

function getPaymentAggregatorBaseUrl() {
  switch (process.env.APP_ENV) {
    case 'local':
      // Relative base URL so the browser calls same-origin (localhost:8080).
      // The /api/v1/* rewrite below proxies those calls to the real API
      // server-side, avoiding the CORS block on *.zalopay.vn endpoints.
      return ''
    case 'development':
      return 'https://dev-payment-aggregator.zalopay.vn'
    case 'staging':
      return 'https://stg-payment-aggregator.zalopay.vn'
    case 'production':
      return 'https://payment-aggregator.zalopay.vn'
  }
}

const nextConfig = {
  webpack: (config) => {
    // Handle SVG imports as React components
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },

      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    )
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i
    }
    return config
  },
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scdn.zalopay.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'stccps.zpapps.vn',
      },
      {
        protocol: 'https',
        hostname: 'simg.zalopay.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'staticsbqc.zalopay.vn/zlp-website',
      },
      {
        protocol: 'https',
        hostname: 'staticsbqc.zalopay.com.vn',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  rewrites: async () => {
    // In local dev, proxy API calls to the real ZaloPay backend server-side
    // (no CORS). Other envs keep the original same-origin backend proxy.
    const apiProxyDestination =
      process.env.APP_ENV === 'local'
        ? 'https://payment-aggregator.zalopay.vn/api/v1/:path*'
        : 'http://localhost:8080/:path*'
    return [
      {
        source: '/health',
        destination: '/api/health',
      },
      {
        source: '/info',
        destination: '/api/info',
      },
      {
        source: '/api/v1/:path*',
        destination: apiProxyDestination, // Proxy to Backend
      },
      {
        source: '/dien',
        destination: '/bill/electric/customer-input',
      },
      {
        source: '/dien/chi-tiet-hoa-don',
        destination: '/bill/electric/bill-details',
      },
      {
        source: '/nuoc',
        destination: '/bill/water/customer-input',
      },
      {
        source: '/nuoc/chi-tiet-hoa-don',
        destination: '/bill/water/bill-details',
      },
      {
        source: '/truyen-hinh',
        destination: '/bill/television',
      },
      {
        source: '/truyen-hinh/chi-tiet-hoa-don',
        destination: '/bill/television/detail',
      },
      {
        source: '/vay-tieu-dung',
        destination: '/bill/consumer-finance',
      },
      {
        source: '/vay-tieu-dung/chi-tiet-hoa-don/:code',
        destination: '/bill/consumer-finance/bill-details/:code',
      },
      {
        source: '/vay-tieu-dung/danh-sach-hop-dong',
        destination: '/bill/consumer-finance/contract-list',
      },
      {
        source: '/chung-cu',
        destination: '/bill/apartment/customer-input',
      },
      {
        source: '/chung-cu/chi-tiet-hoa-don/:code',
        destination: '/bill/apartment/bill-details/:code',
      },
      {
        source: '/internet',
        destination: '/bill/internet/customer-input',
      },
      {
        source: '/internet/chi-tiet-hoa-don',
        destination: '/bill/internet/bill-details',
      },
      {
        source: '/hoc-phi',
        destination: '/bill/education/customer-input',
      },
      {
        source: '/hoc-phi/chi-tiet-hoa-don/:code',
        destination: '/bill/education/bill-details/:code',
      },
      {
        source: '/hoc-phi/danh-sach-hoc-sinh',
        destination: '/bill/education/student-list',
      },
      {
        source: '/hoc-phi/uts',
        destination: '/bill/custom/education/uts/customer-input',
      },
      {
        source: '/hoc-phi/uts/chi-tiet-hoa-don/:code',
        destination: '/bill/custom/education/uts/bill-details/:code',
      },
      {
        source: '/hoc-phi/ima',
        destination: '/bill/custom/education/ima/customer-input',
      },
      {
        source: '/hoc-phi/ima/chi-tiet-hoa-don/:code',
        destination: '/bill/custom/education/ima/bill-details/:code',
      },
      {
        source: '/the-dien-thoai',
        destination: '/telco/phone-card',
      },
      {
        source: '/nap-dien-thoai',
        destination: '/telco/topup',
      },
      {
        source: '/dien-thoai-tra-sau',
        destination: '/telco/post-paid',
      },
      {
        source: '/nap-data',
        destination: '/telco/data-topup',
      },
      {
        source: '/the-data',
        destination: '/telco/data-code',
      },
      {
        source: '/combo-dien-thoai',
        destination: '/telco/combo',
      },
      {
        source: '/ma-the-google-play',
        destination: '/telco/google-play',
      },
      {
        source: '/mua-the-game/tat-ca-tin-tuc',
        destination: '/game/blogs',
      },
      {
        source: '/mua-the-game/tin-tuc',
        destination: '/game/blog',
      },
      {
        source: '/mua-the-game/ket-qua-giao-dich',
        destination: '/game/transactions',
      },
      {
        source: '/mua-the-game',
        destination: '/game',
      },
      {
        source: '/dich-vu/gioi-thieu',
        destination: '/about',
      },
      {
        source: '/dich-vu/dieu-khoan-su-dung',
        destination: '/terms',
      },
      {
        source: '/dich-vu/chinh-sach-bao-mat',
        destination: '/privacy',
      },
      {
        source: '/dich-vu/chinh-sach-ban-hang',
        destination: '/policy',
      },
      {
        source: '/dich-vu/chinh-sach-hoan-huy-va-boi-hoan',
        destination: '/refund-policy',
      },
      {
        source: '/dich-vu/faq',
        destination: '/faq',
      },
      {
        source: '/dich-vu/ket-qua-giao-dich/:transactionID*',
        destination: '/transactions/:transactionID*',
      },
      {
        source: '/dich-vu',
        destination: '/',
      },
    ]
  },
  assetPrefix: getAssetPrefix(),
  env: {
    NEXT_PUBLIC_ZLP_TELCO_PORTAL_WEBAPP_BASE_URL: getZlpTelcoPortalWebappBaseUrl(),
    NEXT_PUBLIC_INTERNAL_ZLP_WEBSITE_BASE_URL: getInternalZlpWebsiteBaseUrl(),
    NEXT_PUBLIC_PAYMENT_AGGREGATOR_BASE_URL: getPaymentAggregatorBaseUrl(),
  },
}

module.exports = nextConfig
