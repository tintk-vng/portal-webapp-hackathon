import Image from '@/components/common/image'
import warning from '@/public/images/icons/general_warning.svg'

interface DueDateProps {
  dueDate: string
}

export default function DueDate({ dueDate }: DueDateProps) {
  if (!dueDate) {
    return null
  }
  return (
    <div className="flex items-center rounded-lg bg-orange-25 px-2.5 py-3">
      <Image className="mr-2" src={warning} alt="warning-icon" />
      <label className="text-sm">
        Hạn thanh toán: <b>{dueDate}</b>
      </label>
    </div>
  )
}
