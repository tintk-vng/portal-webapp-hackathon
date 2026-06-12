import classNames from 'classnames'
import SeletBottomSheet from '../select-bottom-sheet'

interface GroupData {
  supplier_id: number
  name: string
}
interface GroupsProps {
  groupDatas: GroupData[]
  onGroupClick: (group: GroupData) => void
  selectedGroupID?: number
  isMobile?: boolean
}
export default function Groups({
  groupDatas,
  onGroupClick,
  selectedGroupID = 0,
  isMobile = false,
}: GroupsProps) {
  if (isMobile) {
    return (
      <SeletBottomSheet
        title="Chọn khu vực"
        optionDatas={groupDatas.map(({ supplier_id, name, ...others }) => ({
          supplier_id, name,
          passData: JSON.stringify(others),
        }))}
        onOptionClick={({ supplier_id, name, passData = '' }) => {
          onGroupClick({ supplier_id, name, ...JSON.parse(passData) })
        }}
        selectedOptionID={selectedGroupID}
      />
    )
  }

  return (
    <div className="flex w-full gap-x-3 overflow-x-scroll md:overflow-x-hidden">
      {groupDatas.map((groupData) => {
        const isSelected = groupData.supplier_id === selectedGroupID
        return (
          <button
            type="button"
            key={groupData.supplier_id}
            className={classNames({
              'whitespace-nowrap rounded-full px-3 py-2.5 text-label-lg ring-1 ring-inset transition-[box-shadow]':
                true,
              'bg-white-500 text-blue-500 ring-blue-500': isSelected,
              'bg-blue-25 ring-blue-25': !isSelected,
            })}
            onClick={() => onGroupClick(groupData)}
          >
            {groupData.name}
          </button>
        )
      })}
    </div>
  )
}
