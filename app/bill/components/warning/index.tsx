import Image from '@/components/common/image'
import warning from '@/public/images/icons/general_warning.svg'
interface IWarning {
    title?: string;
    children: any
}
const Warning = ({title = 'Lưu ý:', children = null}: Partial<IWarning>) => {
  return (
    <div className="rounded-lg bg-orange-25 px-2.5 py-3">
      <div className="flex items-center">
        <Image className="mr-2" src={warning} alt="warning-icon" />
        <label className="text-sm font-bold">{title}</label>
      </div>
      {children}
    </div>
  )
}
export default Warning
