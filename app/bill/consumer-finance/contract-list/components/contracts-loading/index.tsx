import Skeleton from '@/components/common/skeleton'
const ContractsLoading = () => {
  return (
    <>
      <p className="mb-3 text-xl font-bold md:mb-6 md:text-2xl">Nhập thông tin hoá đơn</p>
      <div className="flex flex-col items-center gap-y-4 md:p-6 md:shadow-[0_2px_12px_0] md:shadow-dark-500/5 ">
        <div className="w-full">
          <p className="text-base font-bold">Chọn hợp đồng</p>
        </div>
        <div className="w-full">
          {[1, 2, 3].map((item: any, index: number) => {
            return (
              <div key={index} className="mb-3">
                <div className="rounded-lg border border-dark-50 p-3">
                  <div className="flex items-center">
                    <Skeleton className="h-[36px] w-[36px] rounded-lg" />
                    <Skeleton className="ml-3 h-[24px] w-[80px] rounded-lg" />
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Skeleton className="h-[24px] w-[120px] rounded-lg" />
                    <Skeleton className="h-[24px] w-[120px] rounded-lg" />
                  </div>

                  <div className="my-3 h-[1px] bg-dark-50" />
                  <div className="flex justify-between">
                    <Skeleton className="h-[24px] w-[120px] rounded-lg" />
                    <Skeleton className="h-[24px] w-[120px] rounded-lg" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
export default ContractsLoading
