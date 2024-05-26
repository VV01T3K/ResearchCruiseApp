import {useEffect, useRef, useState} from "react";

export default function DisabledByDefaultTextArea (props:{onChange, value}) {
    const [disabled, setDisabled] = useState(true)
    const divRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (divRef.current && !divRef.current.contains(event.target)) {
                setDisabled(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return <div  ref={divRef} onClick={()=>setDisabled(false) }>
        {!disabled && <textarea className={`w-100 h-100 ${disabled ? "text-primary":""}`} style={{resize:"none"}} value={props.value} onChange={props.onChange} onClick={()=>setDisabled(false)}/>}
        {disabled && <div className={"w-100 h-100"}  >{props.value ?? "Brak"}</div>}

    </div>
}