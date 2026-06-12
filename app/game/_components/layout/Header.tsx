'use client'

import StaticImage from '@/components/common/static-image'
import Header from '@/components/layout/header'
import useToggle from '@/hooks/use-toggle'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function CustomHeader() {
  const pathname = usePathname() ?? ''
  const [visible, toggle] = useToggle()
  const [navbarClassName, setNavbarClassName] = useState({
    container: 'lnl-invisible lnl-translate-x-[-100%]',
  })

  const handleNavbarToggle = () => {
    toggle()
    if (visible) {
      setNavbarClassName({
        container: 'lnl-invisible lnl-transition-all lnl-duration-300 lnl-translate-x-[-100%]',
      })
    } else {
      setNavbarClassName({
        container: 'lnl-visible lnl-transition-all lnl-duration-300 lnl-translate-x-0',
      })
    }
  }

  const Navigations = () => (
    <div className="flex h-full flex-col space-y-4 px-4 md:flex-row md:items-center md:justify-center md:space-x-6 md:space-y-0 md:px-8">
      <a
        className={classNames({
          'font-bold': true,
          'text-blue-500': ['/', '/game'].includes(pathname),
          'text-dark-400': !['/', '/game'].includes(pathname),
        })}
        href="/"
        rel="noopener noreferrer"
      >
        Nạp ngay
      </a>

      <a
        className={classNames({
          'font-bold': true,
          'text-dark-400': !['/tat-ca-tin-tuc', '/game/blogs'].includes(pathname),
          'text-blue-500': ['/tat-ca-tin-tuc', '/game/blogs'].includes(pathname),
        })}
        href="/tat-ca-tin-tuc"
        rel="noopener noreferrer"
      >
        Tin tức
      </a>
    </div>
  )

  return (
    <Header
      CustomHeader={
        <header>
          <div className="h-14 w-full md:h-[72px]" />

          <nav className="fixed left-0 top-0 z-30 h-14 w-full bg-white-500 shadow-[0px_2px_12px_rgba(0,31,62,0.05)] md:h-[72px]">
            <div className="mx-auto flex h-full max-w-6xl flex-wrap items-center justify-between px-4 md:px-6">
              <div className="flex h-full items-center space-x-4 md:space-x-0">
                <button
                  className="lnl-inline-flex lnl-items-center md:lnl-hidden"
                  onClick={handleNavbarToggle}
                >
                  <span
                    className={classNames({
                      'lnl-h-6 lnl-w-6 lnl-min-w-6 lnl-cursor-pointer lnl-bg-contain lnl-g-no-repeat':
                        true,
                      "lnl-bg-[url('https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons/collapse_menu.svg')]":
                        visible,
                      "lnl-bg-[url('https://scdn.zalopay.com.vn/zst/zpi/images/telco/icons/expand_menu.svg')]":
                        !visible,
                    })}
                  />
                </button>

                <a
                  className="relative inline-block h-full w-[105px] md:w-[124px]"
                  href="/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <StaticImage
                    className="h-full w-auto object-contain"
                    src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/full_zalopay.svg"
                    fill
                    alt="zalopay-logo"
                  />
                </a>
              </div>

              <div className="hidden md:block">
                <Navigations />
              </div>

              <a
                href="https://napthevui.vn"
                rel="noopener noreferrer"
                target="_blank"
                className="flex h-full flex-1 cursor-pointer flex-col items-end justify-center gap-x-1 whitespace-break-spaces text-right text-label-xs font-bold text-blue-500 underline md:flex-row md:items-center md:justify-end md:whitespace-normal md:text-label-lg"
              >
                Web nạp thẻ
                <span className="text-green-500">rẻ, nhanh và uy tín</span>
              </a>

              <div
                className={classNames({
                  'lnl-fixed lnl-left-0 lnl-top-14 lnl-z-10 lnl-h-[calc(100%-56px)] lnl-w-full lnl-items-center lnl-justify-between lnl-overflow-x-auto lnl-bg-white-500 md:lnl-visible md:lnl-static md:lnl-order-1 md:lnl-flex md:lnl-h-full md:lnl-w-auto md:lnl-translate-x-0 md:lnl-overflow-visible md:lnl-transition-none':
                    true,
                  [navbarClassName.container]: true,
                })}
              >
                <div className="block md:hidden">
                  <Navigations />
                </div>
              </div>
            </div>
          </nav>
        </header>
      }
    />
  )
}
