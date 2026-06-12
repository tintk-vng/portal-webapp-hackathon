import '@dgs/looknlearn/styles.css'
import { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'

const myFont = localFont({
  src: [
    {
      path: '../public/fonts/SFProDisplay.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/SFProDisplayBold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
})

const SEOContent = {
  title: 'Zalopay',
  description: 'Thanh toán ngay tại website Zalopay',
}

export const metadata: Metadata = {
  ...SEOContent,
  openGraph: SEOContent,
  twitter: SEOContent,
  appleWebApp: {
    title: SEOContent.title,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/ns.html?id=GTM-5GLDDT9" />

      <Script id="google-tag-manager-1">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5GLDDT9');`}
      </Script>

      <Script src="https://www.googletagmanager.com/ns.html?id=GTM-MF6CRLH" />

      <Script id="google-tag-manager-2">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MF6CRLH');`}
      </Script>

      <Script src="https://scdn.zalopay.com.vn/zst/zlp-website/iframe-resize-sdk/index.global.js" />

      <link rel="apple-touch-icon" href="/apple_touch.png" type="image/png" />

      <body className={myFont.className}>{children}</body>
    </html>
  )
}
