import { PackageType } from "@/constants/bill";
import { IPackageItemProps } from "@/utils/bill";
import commonUtil from "@/utils/common";
import classNames from "classnames"
interface IPackagesItem {
    type: PackageType;
    list: Array<IPackageItemProps>,
    selectingIndex: number,
    title: string,
    column:number,
    onItemClick: (type: PackageType, index: number) => void;
}
const PackagesItem =({list = [], selectingIndex = 0, title = 'Chọn gói dịch vụ', column = 2, onItemClick =()=>{}, type = PackageType.PackageKPlus}: Partial<IPackagesItem>)=>{
    return <>
    {title && <label className="font-bold text-dark-500 text-base">{title}</label>}
    <div className={classNames(`grid grid-cols-${column} gap-${column}`)}>
        {list.map((item: IPackageItemProps,index: number)=>{
            const isActive = selectingIndex === index
            return (<>
                <div 
                onClick={() => onItemClick(type, index)}
                className={classNames(`border-[1px]  ${!item.amount ?'h-[72px] md:h-[52px]':'h-[94px]'} ${isActive? `bg-other-background border-blue-500` : `border-dark-50`} rounded-lg py-4  flex justify-center items-center `)} key={index}>
                   <div className="flex flex-col items-center">
                    <label className={classNames(`${!item.amount && 'font-bold '} ${isActive ? 'text-blue-500' : 'text-dark-500'} text-center px-3`)}>
                        {item.name}
                    </label>
                    {item.amount && <label className={classNames(`font-bold ${isActive ? 'text-blue-500' : 'text-dark-500'} mt-1.5`)}>
                       {commonUtil.formatCurrency(parseInt(item.amount))}
                    </label>}
                   </div>
                </div>
            </>)
        })}
    </div>
    </>
}
export default PackagesItem