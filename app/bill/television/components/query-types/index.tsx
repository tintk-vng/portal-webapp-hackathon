import { QueryType } from '@/types/bill'
import { useFormContext } from 'react-hook-form'
import classNames from 'classnames'
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
  const isSelected =
    queryTypes.type.toString() + queryTypes.name ===
    (selectedQueryType?.type || -1).toString() + (selectedQueryType?.name || '')
  return (
    <div
      onClick={onQueryTypeClick}
      className={classNames(`flex w-[97%] justify-center rounded-3xl
     shadow-dark-500/5 ${isSelected ? `border-[1px] border-solid border-blue-500` : 'bg-blue-25'}`)}
    >
      <label
        className={classNames(
          `flex h-[40px] items-center ${isSelected ? 'text-blue-500' : 'text-dark-500'}`
        )}
      >
        {queryTypes.name}
      </label>
    </div>
  )
}
export default QueryTypesComponent
