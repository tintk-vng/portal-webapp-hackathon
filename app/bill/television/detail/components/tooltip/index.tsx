
import React from "react";
import { useState } from "react";
import './styles.scss';
import useScreen, { ScreenSize } from "@/hooks/use-screen";

interface ITooltipProps {
    title: string;
    placement?: 'top' | 'left' | 'right',
    children: React.ReactNode;
    onClick?: Function;
}

const Tooltip = (props: ITooltipProps) => {
    const { title, placement = 'top', children, onClick = () => {} } = props;
    const [show, setShow] = useState(false);
    const { size } = useScreen()
    const isMobile = size === ScreenSize.MEDIUM || size === ScreenSize.SMALL
    return (
        <div className="zlp-tooltip" onClick={() => {setShow(!show); onClick(!show)}}>
            <span style={{left:isMobile ? -100 : -16 }} className={`zlp-tooltip__tooltip ${placement} ${isMobile ? 'arrow_mobile' :''} ${show ? 'active' : 'inactive'}`}>
                <label >{title}</label>
            </span>
            {children}
        </div>
    )
}
export default Tooltip;