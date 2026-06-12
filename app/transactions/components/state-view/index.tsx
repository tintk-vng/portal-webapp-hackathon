import Image from '@/components/common/image'

interface StateViewProps {
  image: string
  title: string
  description?: string
}
export default function StateView({ image, title, description = '' }: StateViewProps) {
  return (
    <div className="flex flex-col items-center pt-6 text-label-md md:py-3 md:text-label-lg">
      <Image src={image} alt="artwork" className="h-[80px] w-[80px] md:mb-4" />
      <div className="flex flex-col gap-y-2 px-8 pb-4 pt-6 text-center md:gap-y-3 md:p-0">
        <p className="text-label-lg font-bold md:text-2xl">{title}</p>
        {description.length > 0 && <p className="text-dark-300 md:text-xl">{description}</p>}
      </div>
    </div>
  )
}
