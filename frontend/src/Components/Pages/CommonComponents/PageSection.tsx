import React, {useEffect, useState} from "react";
import useCustomEvent from "../../Tools/useCustomEvent";


type Props = {
    id?: string,
    children?:
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>[] |
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>,
    title: string,
}



function PageSection(props: Props) {
    const [isActive, setIsActive] = useState(true);

    return  (
        <div className="accordion-item border-2 border-black border-bottom">
            <div onClick={() => setIsActive(!isActive)}
                 id={props.id}
                 className={"accordion-title d-flex flex-row pt-2 pb-2 ps-3 pe-3 bg-light sticky-top z-2 border-bottom "}
                 style={{cursor:"pointer"}}
            >
                <div className={"d-flex flex-column col-10"} style={{fontSize: "1rem"}}>
                    {props.id + '. ' + props.title} {isActive ? "▲" : "▼"}
                </div>
            </div>
            <div
                className={`d-flex flex-row flex-wrap justify-content-center p-2 ${isActive ? ' ' : 'visually-hidden'}`}
                style={{fontSize:"0.8rem"}}
            >
                {React.Children.map(props.children, (child, index) =>
                    child
                )}
            </div>
        </div>
    )
}


export default PageSection