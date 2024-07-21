import {ReactElement} from "react";
import {ResponsiveAlignProp} from "react-bootstrap/types";

type Props = {
    children?: ReactElement | ReactElement[],
    className?: string
}


export default function PageMenuBar(props: Props) {
    return (
        <div className={`d-flex flex-wrap w-100 ${props.className ?? ""}`}>
            {props.children}
        </div>
    )
}