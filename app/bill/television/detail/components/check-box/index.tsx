import Image from "@/components/common/image"
import checkBox from "@/public/images/icons/checkbox.svg"
import unCheckBox from "@/public/images/icons/un_checkbox.svg"
interface ICheckBox {
    active: boolean
    onChange: Function
    label: string
}
const CheckBox=({active = false, onChange=()=>{}, label= ''}: Partial<ICheckBox>)=>{
    return <div className="flex items-center">
        <Image src={active ? checkBox : unCheckBox } alt=""/>
        <label className="ml-3">{label}</label>
    </div>
}
export default CheckBox