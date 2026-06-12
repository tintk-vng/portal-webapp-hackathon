import RowInfo from '@/app/transactions/components/row-info'
import Button, { ButtonSize, ButtonType } from '@/components/common/button'
import { Transaction } from '@/types/common'
import commonUtil from '@/utils/common'
import { useState } from 'react'
import { set } from 'react-hook-form'

interface CardTransactionProps {
  transaction: Transaction
}

export default function CardTransaction({ transaction }: CardTransactionProps) {
  // const [isCoppied, setIsCoppied] = useState<string>('')

  const handleCopyToClipboard = async (type: string, content: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(content)
        // setIsCoppied(type)
        // setTimeout(() => setIsCoppied(''), 2000)
      }
    } catch (error) {
      console.log('Failed to copy to clipboard: ', error)
    }
  }

  return (
    <div className="mt-4 px-4 md:mt-10 md:px-0">
      <div className="md:rounded-lg md:border md:border-dark-50 md:px-6 md:pb-3 md:pt-6">
        <p className="mb-1 text-base font-bold md:mb-2">Thông tin giao dịch</p>

        <div className="divide-y divide-dark-50 text-label-md md:text-label-lg">
          <RowInfo title="Nhà cung cấp dịch vụ" value={transaction.customData.supplier_name} />

          <RowInfo
            title="Mệnh giá thẻ"
            value={commonUtil.formatCurrency(transaction.customData.unit_price)}
          />

          <RowInfo>
            <label className="w-1/3 text-dark-300">Email nhận thẻ</label>

            <label className="w-2/3 text-right">{transaction.email}</label>
          </RowInfo>

          <RowInfo>
            <label className="w-full text-dark-300">Tổng tiền đơn hàng</label>

            <label className="w-full text-right font-bold">
              {commonUtil.formatCurrency(transaction.amount)}
            </label>
          </RowInfo>
        </div>

        {transaction.cards?.length && (
          <div className="mt-6">
            <div className="mb-3 text-heading-sm md:mb-4">Thông tin mã thẻ</div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-8">
              {transaction.cards.map((card, index) => (
                <div key={card.code}>
                  <div className="mb-3 text-heading-sm font-normal">Mã thẻ {index + 1}</div>

                  <div className="overflow-hidden rounded-lg border border-blue-100 bg-white-500">
                    <div className="flex items-center justify-between bg-other-background px-4 py-2">
                      <div className="text-label-lg font-bold">
                        {transaction.customData.package_name}
                      </div>

                      {card.expireTime && (
                        <div className="text-label-md text-dark-300">HSD: {card.expireTime}</div>
                      )}
                    </div>

                    <div className="flex flex-col items-center px-8 py-2">
                      <div className='h-full w-full bg-[url("https://scdn.zalopay.com.vn/zst/zpi/images/telco/patterns/silver_foil_2.svg")] bg-contain bg-no-repeat p-1'>
                        <div className="flex items-center justify-center bg-blue-25 px-3 py-1 text-label-lg font-bold">
                          {card.code}
                        </div>
                      </div>

                      <div className="mt-2 text-center text-label-sm text-dark-300">
                        Số seri: {card.serialNo}
                      </div>
                    </div>

                    <div className="flex gap-3 px-8 pb-3">
                      <Button
                        width="w-full flex-1"
                        type={ButtonType.SECONDARY}
                        size={ButtonSize.SMALL}
                        bold={false}
                        onClick={() => handleCopyToClipboard('serialNo', card.serialNo)}
                      >
                        Sao chép Số seri
                      </Button>

                      <Button
                        width="w-full flex-1"
                        type={ButtonType.SECONDARY}
                        size={ButtonSize.SMALL}
                        bold={false}
                        onClick={() => handleCopyToClipboard('code', card.code)}
                      >
                        Sao chép mã thẻ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
