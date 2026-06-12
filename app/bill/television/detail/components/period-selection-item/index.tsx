import { IPeriodSelectionItem } from "@/types/bill/television"
import CheckBox from "../check-box"
import classNames from "classnames"

const PeriodSelectionItem=({active = true ,label = '', value = '', onChange =()=>{}, disble = false, underline = true}: Partial<IPeriodSelectionItem>)=>{
    return <div className={classNames(`pb-4 ${underline && 'border-b-[1px] border-[#E6E9EC]'}`)}>
       <div  onClick={()=>{
        if(!disble) {
            onChange()
        }
       }} 
       className={classNames(`${disble && 'opacity-50'} flex justify-between`)}>
       <CheckBox active={active} label={label}/>
        <label className='font-bold'>{value}</label>
       </div>
    </div>
}
export default PeriodSelectionItem