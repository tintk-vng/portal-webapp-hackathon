interface TncProps {
  refCTAText: string
}

export default function Tnc({ refCTAText }: TncProps) {
  return (
    <div className="mt-3 text-label-md text-dark-300 md:mt-4">
      {`Nhấn ${refCTAText} đồng nghĩa với việc Quý khách đồng ý với chính sách và điều khoản của Zalopay`}
    </div>
  )
}
