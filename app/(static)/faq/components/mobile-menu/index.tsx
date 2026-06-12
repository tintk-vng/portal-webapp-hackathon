import commonUtil from '@/utils/common'
import { useEffect, useState } from 'react'
import { IMenu, ISubMenu } from '../../page'
import Menu from '../menu'
import SubMenu from '../sub-menu'
import Tab from '../tab'

interface MobileMenusProps {
  menus: IMenu[]
  subMenuID: string
  onMenuClick: (menu: IMenu) => void
  onSubMenuClick: (subMenu: ISubMenu) => void
}
export default function MobileMenus({
  menus,
  subMenuID,
  onMenuClick,
  onSubMenuClick,
}: MobileMenusProps) {
  const [collapsedMenu, setCollapsedMenu] = useState<IMenu>({} as IMenu)
  const [subMenus, setSubMenus] = useState<ISubMenu[]>([])
  const showMenus = menus.filter((menu) => !commonUtil.isEmpty(menu.subMenus))

  useEffect(() => {
    const tmp = showMenus.find((menu) => menu.isCollapsed) ?? showMenus[0]
    setCollapsedMenu(tmp)
    setSubMenus(tmp.subMenus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (commonUtil.isEmpty(showMenus)) {
    return null
  }

  if (commonUtil.isEmpty(collapsedMenu)) {
    return null
  }

  function handleClickMenu(selectedMenu: IMenu) {
    setCollapsedMenu(selectedMenu)
    setSubMenus(selectedMenu.subMenus)
    onMenuClick(selectedMenu)
  }

  return (
    <>
      <Menu title={collapsedMenu.title} preIconLink={collapsedMenu.preIconLink} className="mb-2">
        {showMenus.map((menu) => {
          return (
            <SubMenu
              key={menu.ID}
              onClick={() => handleClickMenu(menu)}
              title={menu.title}
              isActive={menu.ID === collapsedMenu.ID}
            />
          )
        })}
      </Menu>
      <div className="-mx-3 flex overflow-x-scroll pb-2">
        {!commonUtil.isEmpty(subMenus) &&
          subMenus.map((subMenu) => (
            <Tab
              key={subMenu.ID}
              className="h-[46px] w-fit whitespace-nowrap px-4 font-bold "
              onClick={() => onSubMenuClick(subMenu)}
              title={subMenu.title}
              isActive={subMenu.ID === subMenuID}
            />
          ))}
      </div>
    </>
  )
}
