import React, {CSSProperties, useEffect, useState} from "react";

type Props = {
    nazwa: string,
    kolor: string,
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>
};

export default function Kwadrat(props: Props){
    const [color, setColor] = useState("red")
    const [fontSize, setFontSize] = useState(14)
    useEffect(()=>{
        setFontSize(fontSize+1)
    }, [color])
    return <h1 style={{color: color} as CSSProperties}>
        {props.nazwa}
        {props.children}
        {fontSize}
        <button onClick={()=>setColor(color == "blue" ? "red": "blue")}/>
    </h1>
}