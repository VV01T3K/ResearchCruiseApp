import {ReactElement} from "react";
import {ResponsiveAlignProp} from "react-bootstrap/types";

type Props = {
    children?: ReactElement | ReactElement[]
}


export default function PageMenuBar(props: Props) {
    return (
        <div className="d-flex flex-wrap w-100">
            {props.children}
        </div>
    )
}