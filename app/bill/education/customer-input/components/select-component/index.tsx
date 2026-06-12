import Image from '@/components/common/image'

interface ISelectComponent {
  value: string
  placeholder: string
  icon: any
  onClick: Function
  errMsg: string
}
const SelectComponent = ({
  value = '',
  placeholder = '',
  icon = null,
  onClick = () => {},
  errMsg = '',
}: Partial<ISelectComponent>) => {
  const isError = errMsg
  return (
    <div className="w-full">
      <div
        onClick={() => {
          onClick()
        }}
        className={`flex h-[52px] w-full items-center rounded-lg border-[1px] border-dark-100 px-4 ${
          isError && `border-red-500`
        }`}
      >
        {value ? (
          <label className="flex-1">{value}</label>
        ) : (
          <label className="flex-1 text-dark-200">{placeholder}</label>
        )}
        {icon && <Image src={icon} width={36} height={36} alt="" />}
      </div>
      {isError && (
        <div className="w-full text-left">
          <label className="text-sm text-red-500">{errMsg}</label>
        </div>
      )}
    </div>
  )
}
export default SelectComponent
