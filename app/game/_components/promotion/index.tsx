import StaticImage from '@/components/common/static-image'

export default function Promotion() {
  return (
    <div className="relative z-0 mb-3 flex flex-row items-center gap-2 overflow-hidden rounded-lg bg-[#E7F6FF] px-4 py-3 before:absolute before:inset-0 before:z-[-1] before:h-full before:w-full before:bg-[url('https://scdn.zalopay.com.vn/zst/zpi/images/telco/patterns/promotion.svg')] before:bg-cover before:bg-no-repeat before:content-['']">
      <StaticImage
        src="https://scdn.zalopay.com.vn/zst/zpi/images/telco/artworks_v2/promotion.png"
        width={44}
        height={44}
        alt="promotion-artwork"
        loader={({ src }) => src}
      />

      <div className="flex flex-col justify-between gap-0.5">
        <div className="bg-gradient-to-r from-green-500 via-[#3DB7B7] to-[#0083A4] bg-clip-text text-label-lg font-bold text-transparent">
          Giảm đến 3% giao dịch bất kỳ
        </div>

        <div className="text-label-md">Ưu đãi có hạn</div>
      </div>
    </div>
  )
}
