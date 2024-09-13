import {ReactElement} from "react";

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