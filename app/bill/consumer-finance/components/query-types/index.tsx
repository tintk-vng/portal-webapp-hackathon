import { QueryType } from '@/types/bill'
import CheckBoxIcon from '../check-box'
import { useFormContext } from 'react-hook-form'
interface IQueryTypesComponent {
  queryTypes: QueryType
  selectedQueryType?: QueryType
  onChange?: Function
}
const FIELD_NAME = 'customerCode'
const QueryTypesComponent = ({
  queryTypes,
  selectedQueryType,
  onChange = () => {},
}: IQueryTypesComponent) => {
  const { clearErrors } = useFormContext()

  const onQueryTypeClick = () => {
    clearErrors(FIELD_NAME)
    onChange(queryTypes)
  }
  return (
    <div
      onClick={onQueryTypeClick}
      className="flex items-center rounded-lg pb-3 pl-4 pr-4 pt-3 shadow-[0_2px_12px_0] shadow-dark-500/5 "
    >
      <div className="h-[24px] w-[24px]">
        <CheckBoxIcon
          isSelected={
            queryTypes.type.toString() + queryTypes.name ===
            (selectedQueryType?.type || -1).toString() + (selectedQueryType?.name || '')
          }
        />
      </div>
      <label className="ml-3 flex h-[60px] items-center md:h-[36px]">{queryTypes.name}</label>
    </div>
  )
}
export default QueryTypesComponent
