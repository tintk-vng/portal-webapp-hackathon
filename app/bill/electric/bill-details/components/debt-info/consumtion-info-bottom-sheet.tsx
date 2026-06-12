import BottomSheet from '@/components/common/bottom-sheet'
import Modal from '@/components/common/modal'
import useOutsideClick from '@/hooks/use-outside-click'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import React, { useRef } from 'react'

export interface ComsumptionInfoBottomSheetProps {
  visible: boolean
  onClose: () => void
  fields: { label: string; value: number }[]
}

export default function ComsumptionInfoBottomSheet({
  visible,
  onClose,
  fields,
}: ComsumptionInfoBottomSheetProps) {
  const DialogRef = useRef(null)
  useOutsideClick(DialogRef, onClose)
  const { size } = useScreen()

  if (!visible) {
    return null
  }

  const Info = () => (
    <ul>
      {fields.map(
        (field, index) =>
          field.value && (
            <li
              key={index}
              className="flex min-h-[50px] items-center justify-between border-t-0 border-dark-50 py-4 last:border-t md:min-h-[56px]"
            >
              <label className="text-label-lg text-dark-300">{field.label}</label>

              <label className="max-w-[50%] text-end text-label-lg">{field.value} kWh</label>
            </li>
          )
      )}
    </ul>
  )

  return (
    <>
      {size === ScreenSize.SMALL && (
        <BottomSheet
          visible={visible}
          title="Thông tin tiêu thụ"
          onClose={onClose}
          primaryCTAText="Đã hiểu"
          onPrimaryCTAClick={onClose}
        >
          <Info />
        </BottomSheet>
      )}

      {size !== ScreenSize.SMALL && (
        <Modal
          visible={visible}
          onClose={onClose}
          primaryCTAText="Đã hiểu"
          size="sm"
          onPrimaryCTAClick={onClose}
        >
          <div>
            <div className="mb-4 mt-6 text-center text-heading-lg">Thông tin tiêu thụ</div>

            <Info />
          </div>
        </Modal>
      )}
    </>
  )
}
