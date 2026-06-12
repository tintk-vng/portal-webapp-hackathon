interface PaymentGuideProps {
  title: string
  descriptions: string[]
}

export default function PaymentGuide({ title, descriptions }: PaymentGuideProps) {
  return (
    <div className="rounded-lg bg-orange-25 p-4">
      <p className="mb-3 text-paragraph-lg font-bold md:mb-4 md:text-xl">{title}</p>

      <ul className="list-inside list-disc">
        {descriptions.map((description, index) => (
          <li key={index} className="mb-3">
            <label
              className="text-label-lg text-dark-400"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
