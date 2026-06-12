interface CustomerInfoProps {
  billInfo: any
}

export default function CustomerInfo({ billInfo }: CustomerInfoProps) {
  const fields = [
    { label: 'Mã học sinh', value: billInfo.customerCode },
    { label: 'Tên học sinh', value: billInfo.customerName },
    { label: 'Số điện thoại', value: billInfo.phoneNumber },
    { label: 'Địa chỉ', value: billInfo.address },
    { label: 'Số CMND/CCCD', value: billInfo.identityNumber },
    { label: 'Ngày sinh', value: billInfo.dateOfBirth },
    { label: 'Trường học', value: billInfo.schoolName },
    { label: 'Lớp', value: billInfo.className },
  ]

  return (
    <div className="mb-4">
      <div className="mb-3 text-heading-sm md:mb-2">Thông tin học sinh</div>

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
