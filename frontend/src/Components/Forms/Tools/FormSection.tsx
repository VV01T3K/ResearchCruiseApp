import React, {useState} from "react";

function FormSection(props: {children?: React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>[] | React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>,
    title:string, id:string, completed:(string | boolean)[]}){

    const [isActive, setIsActive] = useState(true);



    return  (<div className="accordion-item border-2 border-black border-bottom">
                <div onClick={() => setIsActive(!isActive)} id={props.id} className={" accordion-title d-flex flex-row p-3  bg-light sticky-top z-2 "} >
                   <h1 className={"d-flex flex-column col-6  align-self-center"} style={{fontSize: "1.5rem"}}>{props.title}</h1>
                    <h1 className={`d-flex flex-column col-6 text-end ${props.completed.at(1) ? "text-success": "text-danger"} align-self-center`} style={{fontSize: "1.5rem"}}>{props.completed.at(1) ? "+" : "!"}</h1>
                </div>
         <div className={`d-flex flex-row flex-wrap justify-content-center  pb-2 ${isActive ? ' ': 'visually-hidden'}`}>
                    {props.children}
                </div>
            </div>
    )
}

export default FormSection