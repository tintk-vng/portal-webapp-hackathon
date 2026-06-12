import educationAPI from '@/api-client/bill/education'
import BottomSheet from '@/components/common/bottom-sheet'
import Modal from '@/components/common/modal'
import useScreen, { ScreenSize } from '@/hooks/use-screen'
import educationModel from '@/models/bill/education'
import { PeriodDetails } from '@/types/bill/education'
import commonUtil from '@/utils/common'
import { useEffect, useState } from 'react'
import { Period } from '.'

interface PeriodDetailsBottomSheetProps {
  period: Period
  visible: boolean
  onClose: (period: Period) => void
}

export default function PeriodDetailsBottomSheet({
  period,
  visible,
  onClose,
}: PeriodDetailsBottomSheetProps) {
  const { size } = useScreen()
  const { customerCode, billID, supplierID, month, totalAmount } = period
  const [periodDetails, setPeriodDetails] = useState<PeriodDetails>({} as PeriodDetails)

  const handleClose = () => {
    setPeriodDetails({} as PeriodDetails)
    onClose({} as Period)
  }

  const getBillDetails = async () => {
    try {
      console.log('billID', billID)
      const response = await educationAPI.getBillDetails({
        billID,
        supplierID,
        customerCode,
        month,
      })
      const periodDetails = educationModel.modelPeriodDetails(response)
      setPeriodDetails(periodDetails)
    } catch (error) {
      console.log('Failed to get bill details: ', error)
      handleClose()
    }
  }

  useEffect(() => {
    if (visible) {
      getBillDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  if (commonUtil.isEmpty(periodDetails.bills)) {
    return null
  }

  const PeriodDetails = () => (
    <div>
      <table className="mb-4 w-full table-fixed">
        <thead className="text-label-md font-bold text-dark-300">
          <tr className="border-b border-dark-50">
            <th scope="col" className="w-1/4 pb-4 text-left">
              STT
            </th>

            <th scope="col" className="w-2/4 pb-4 text-left">
              Loại phí
            </th>

            <th scope="col" className="w-1/4 pb-4 text-right">
              Số tiền
            </th>
          </tr>
        </thead>

        <tbody className="text-label-md">
          {periodDetails.bills.map((bill: any, index: number) => {
            return (
              <tr key={bill.ID + index} className="border-dark-50 last:border-b">
                <td className="py-3 text-left">{index + 1}</td>

                <td className="py-3 text-left">{bill.description}</td>

                <td className="py-3 text-right">{commonUtil.formatCurrency(bill.amount)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between">
        <label className="text-label-lg font-bold">Tổng tiền thanh toán</label>

        <label className="text-heading-md">{commonUtil.formatCurrency(totalAmount)}</label>
      </div>
    </div>
  )

  if (size === ScreenSize.SMALL) {
    return (
      <BottomSheet
        title={`Danh mục các khoản phí ${month}`}
        visible={visible}
        onClose={handleClose}
        primaryCTAText="Đã hiểu"
        onPrimaryCTAClick={handleClose}
      >
        <PeriodDetails />
      </BottomSheet>
    )
  }

  return (
    <Modal
      title={`Danh mục các khoản phí ${month}`}
      visible={visible}
      onClose={handleClose}
      primaryCTAText="Đã hiểu"
      onPrimaryCTAClick={handleClose}
    >
      <PeriodDetails />
    </Modal>
  )
}
