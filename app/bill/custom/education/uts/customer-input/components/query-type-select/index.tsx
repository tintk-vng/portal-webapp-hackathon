import CheckBoxIcon from '@/app/bill/components/check-box'
import { QueryType } from '@/types/bill'
import commonUtil from '@/utils/common'
import { useFormContext } from 'react-hook-form'

interface QueryTypeSelectProps {
  selectedQueryType: QueryType
  onSelectedQueryTypeChange: (selectedQueryType: QueryType) => void
}

export default function QueryTypeSelect({
  selectedQueryType,
  onSelectedQueryTypeChange,
}: QueryTypeSelectProps) {
  const { getValues } = useFormContext()
  const selectedSupplier = getValues('supplier')

  if (commonUtil.isEmpty(selectedSupplier)) {
    return null
  }

  const { queryTypes } = selectedSupplier

  return queryTypes?.length > 1 ? (
    <div className="mb-3 md:mb-4">
      <div className="mb-3 text-base font-bold text-dark-500 md:mb-4">Tra cứu theo</div>

      <div className="flex space-x-3">
        {selectedSupplier?.queryTypes.map((queryType: QueryType) => {
          return (
            <div
              className="flex w-1/2 items-center rounded-lg px-4 py-3 shadow-[0_2px_12px_0] shadow-dark-500/5"
              key={queryType.name + queryType.type}
              onClick={() => onSelectedQueryTypeChange(queryType)}
            >
              <CheckBoxIcon
                isSelected={
                  queryType.type.toString() + queryType.name ===
                  (selectedQueryType?.type || -1).toString() + (selectedQueryType?.name || '')
                }
              />

              <label className="ml-3 flex h-[60px] items-center md:h-[36px]">
                {queryType.name}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  ) : null
}
