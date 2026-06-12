interface CustomerInfoProps {
  fields: {
    label: string
    value: string
  }[]
}

export default function CustomerInfo({ fields }: CustomerInfoProps) {
  return (
    <div className="mb-4">
      <div className="mb-3 text-heading-sm md:mb-2">Thông tin khách hàng</div>

      <ul>
        {fields.map(
          (field, index) =>
            field.value && (
              <li
                key={index}
                className="flex min-h-[50px] items-center justify-between border-b border-dark-50 py-4 last:border-b-0 md:min-h-[56px]"
              >
                <label className="text-label-lg text-dark-300">{field.label}</label>

                <label className="max-w-[50%] text-end text-label-lg">{field.value}</label>
              </li>
            )
        )}
      </ul>
    </div>
  )
}
