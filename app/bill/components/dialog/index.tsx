import Button, { ButtonSize, ButtonType } from '@/components/common/button'
import Image from '@/components/common/image'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import close from '@/public/images/icons/close.svg'
import { IActionDialog, IDialog } from '@/types/bill'
import React from 'react'
const Dialog = ({
  title = '',
  subtitle = '',
  actions = [],
  visible = false,
  onClose = () => {},
}: Partial<IDialog>) => {
  const { size } = useScreen()
  const isMobile = size === ScreenSize.SMALL
  if (!visible) return null
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-full items-center justify-center bg-other-overlay ">
        <div className="mx-[52px] rounded-lg bg-white">
          <div className="mb-2 px-8 pt-6">
            <p className="text-center text-base font-bold">{title || 'Thông báo'}</p>
          </div>
          <div className="px-8 pb-6">
            <p className="text-center text-sm">{subtitle}</p>
          </div>
          <div className="h-[1px] bg-dark-50" />
          <div className="flex ">
            {actions.map((action: IActionDialog, index: number, actions: Array<IActionDialog>) => {
              return (
                <>
                  <div className="h-12 w-[50%]">
                    <Button
                      width="w-full"
                      type={ButtonType.TEXT_LINK}
                      size={ButtonSize.LARGE}
                      onClick={() => {
                        action.action()
                      }}
                    >
                      {action.title}
                    </Button>
                  </div>
                  {index < actions.length - 1 && <div className="w-[1px] bg-dark-50" />}
                </>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-full items-center justify-center bg-other-overlay ">
      <div className="max-w-[360px] rounded-lg bg-white">
        <div className="flex px-8 py-6">
          <label className="mr-[199px] text-base font-bold">Thông báo</label>
          <div
            onClick={() => {
              onClose()
            }}
          >
            <Image src={close} alt="close" />
          </div>
        </div>
        <div className="h-[1px] bg-dark-50" />
        {title && (
          <div className="px-8 pt-6">
            <label className="text-base font-bold">{title}</label>
          </div>
        )}
        <div className="px-8 pb-8 pt-6">
          <label className="text-base">{subtitle}</label>
        </div>
        <div className="flex justify-between px-8 pb-6">
          {actions.map((action: IActionDialog, index: number) => {
            return (
              <div key={index} className="h-12 w-[49%]">
                <Button
                  width="w-full"
                  type={action.type}
                  size={ButtonSize.LARGE}
                  onClick={() => {
                    action.action()
                  }}
                >
                  {action.title}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default Dialog
