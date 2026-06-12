'use client'

import faqAPI from '@/api-client/common/faq-api'
import Image from '@/components/common/image'
import Skeleton from '@/components/common/skeleton'
import StateView from '@/components/common/state-view'
import StaticImage from '@/components/common/static-image'
import commonModel from '@/models/common'
import commonUtil from '@/utils/common'
import { useState } from 'react'
import useSWR from 'swr'
import Collapse from './components/collapse'
import Menu from './components/menu'
import MobileMenus from './components/mobile-menu'
import SubMenu from './components/sub-menu'

export interface ISubMenu {
  ID: string
  title: string
  shortTitle?: string
}

export interface IMenu {
  ID: string
  title: string
  preIconLink: string
  subMenus: ISubMenu[]
  isCollapsed?: boolean
}

const GET_FAQ_API_PATH = '/faq/api/get-article-list'
const ArrowUpAlignRight = (
  <span className="flex h-[24px] w-[24px] items-center justify-end">
    <Image
      src="https://scdn.zalopay.com.vn/zst/zpi/images/design-system/icons/Second/general_arrow_up1.svg"
      width={16}
      height={16}
      alt="Arrow"
    />
  </span>
)
const menus: IMenu[] = [
  {
    ID: 'telco',
    title: 'Điện thoại',
    preIconLink: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/telco.svg',
    subMenus: [
      // ID: folderID to get questions, not appID
      { ID: '43000586085', title: 'Thanh toán điện thoại trả sau', shortTitle: 'Trả sau' },
      { ID: '43000175207', title: 'Nạp tiền điện thoại', shortTitle: 'Nạp điện thoại' },
      { ID: '43000551734', title: 'Thẻ điện thoại' },
      { ID: '43000551792', title: 'Nạp 3G/4G' },
      { ID: '43000564609', title: 'Gói cước Combo' },
    ],
    isCollapsed: true,
  },
  {
    ID: 'bill',
    title: 'Hóa đơn',
    preIconLink: 'https://scdn.zalopay.com.vn/zst/zpi/images/telco/logos_v2/bill.svg',
    subMenus: [
      // ID: folderID to get questions, not appID
      { ID: '43000551490.0', title: 'Thanh toán hóa đơn Điện', shortTitle: 'Hóa đơn Điện' },
      { ID: '43000551490.1', title: 'Thanh toán hóa đơn Nước', shortTitle: 'Hóa đơn Nước' },
      { ID: '43000551490.2', title: 'Thanh toán Khoản vay' },
      { ID: '43000551490.3', title: 'Thanh toán hóa đơn Internet', shortTitle: 'Hóa đơn Internet' },
      {
        ID: '43000551490.4',
        title: 'Thanh toán hóa đơn Truyền hình',
        shortTitle: 'Hóa đơn Truyền hình',
      },
      { ID: '43000551490.5', title: 'Thanh toán hóa đơn Học phí', shortTitle: 'Hóa đơn Học phí' },
      { ID: '43000551490.6', title: 'Thanh toán hóa đơn Chung cư', shortTitle: 'Hóa đơn Chung cư' },
    ],
  },
  // {
  //   ID: 'travel',
  //   title: 'Du lịch',
  //   preIconLink: TravelLogo,
  //   subMenus: [],
  // },
]

function Questions({ folderID }: { folderID: string }) {
  const skeletonNumber = 5
  const { data, error, isLoading } = useSWR(
    [GET_FAQ_API_PATH, folderID.split('.')[0]],
    ([_, folderID]) => faqAPI.getQuestions({ folderID }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  )
  const questions = commonModel.modelQuestions(data)

  if (isLoading) {
    return (
      <>
        {Array.apply(null, Array(skeletonNumber)).map((value, index) => (
          <Skeleton key={index} className="h-[56px] w-full rounded-lg" />
        ))}
      </>
    )
  }

  if (error) {
    return (
      <StateView
        className="mb-6"
        artworkSrc="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/error_system.png"
        title="Có sự cố xảy ra. Vui lòng thử lại sau. "
        description="Xin lỗi vì sự bất tiện này, vui lòng quay lại sau."
      />
    )
  }

  if (commonUtil.isEmpty(questions)) {
    return null
  }

  return (
    <>
      {questions.map((question) => {
        return (
          <Collapse
            key={question.ID}
            isCollapsed={!!question.isCollapsed}
            title={question.title}
            postIcon={ArrowUpAlignRight}
          >
            {!!question.htmlDescription && (
              <div
                className="px-4 pb-4 pt-2"
                dangerouslySetInnerHTML={{ __html: question.htmlDescription }}
              ></div>
            )}
          </Collapse>
        )
      })}
    </>
  )
}

export default function FAQ() {
  const [folderID, setFolderID] = useState(menus[0].subMenus[0].ID)
  const [title, setTitle] = useState(menus[0].subMenus[0].title)

  function handleClickSubMenu(subMenu: { ID: string; title: string }) {
    setFolderID(subMenu.ID)
    setTitle(subMenu.title)
  }

  function handleClickMobileMenu(selectedMenu: { ID: string }) {
    menus.forEach((menu) => {
      menu.isCollapsed = menu.ID === selectedMenu.ID
    })
  }

  return (
    <div className="px-3 py-6 text-dark-500 md:px-0">
      <p className="mb-2 text-2xl font-bold md:mb-3">Các câu hỏi thường gặp</p>
      <div className="flex flex-col md:flex-row">
        <div className="hidden border-r border-dark-50 md:block md:w-1/4 md:pr-6 ">
          <div className="relative mb-[22px] h-[124px] overflow-hidden rounded-2xl">
            <StaticImage
              src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/faq.png"
              fill
              style={{ objectFit: 'cover' }}
              alt="faq-artwork"
            />
          </div>

          <div className="flex flex-col space-y-3">
            {menus.map((menu) => (
              <Menu
                key={menu.ID}
                title={menu.title}
                preIconLink={menu.preIconLink}
                isCollapsed={menu.isCollapsed}
              >
                {menu.subMenus.map((subMenu) => (
                  <SubMenu
                    key={subMenu.ID}
                    title={subMenu.shortTitle || subMenu.title}
                    onClick={() => handleClickSubMenu(subMenu)}
                    isActive={subMenu.ID === folderID}
                  />
                ))}
              </Menu>
            ))}
          </div>
        </div>
        <div className="mb-3 block md:hidden">
          <MobileMenus
            menus={menus}
            subMenuID={folderID}
            onMenuClick={handleClickMobileMenu}
            onSubMenuClick={handleClickSubMenu}
          />
        </div>
        <div className="flex flex-col gap-y-3 md:w-3/4 md:pl-10">
          <p className="hidden text-xl font-bold md:block">{title}</p>
          <Questions folderID={folderID} />
        </div>
      </div>
    </div>
  )
}
