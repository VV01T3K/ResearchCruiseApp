import React, {useEffect, useState} from "react";
import useCustomEvent from "../../Tools/useCustomEvent";
import {FieldValues} from "react-hook-form";

function FormSection(props: {form?: { formState: { dirtyFields: { [x: string]: undefined; }; errors: { [x: string]: any; }; }; watch: () => unknown; }, id?: string | undefined, children?: React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>[] | React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>,
    title:string}){

    // Sprawdź warunki dla każdego dziecka
    const isChildInvalid = (child: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>> | undefined) => {
        const required = child.props.required ?? true
        const childName = child.props.name;
        if(!required ||  React.Children.count(child) === 0)
            return false
        return !(required && props.form!.formState.dirtyFields[childName] !== undefined && props.form!.formState.errors[childName] === undefined );
    };


    // const { dispatchEvent } = useCustomEvent('sectionStateChange');



    const [isActive, setIsActive] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(()=>{
        const validChildren =
            !Object.values(React.Children.map(props.children, (child) => {
                return isChildInvalid(child)})).some((child)=>child==true)
        // dispatchEvent( {[props.title]:validChildren})
        setIsCompleted(validChildren)

    },[props.form!.watch()])

    useEffect(() => {
      });


    return  (<div className="accordion-item border-2 border-black border-bottom">
                <div onClick={() => setIsActive(!isActive)} id={props.id} className={" accordion-title d-flex flex-row p-3  bg-light sticky-top z-2 "} >
                   <h1 className={"d-flex flex-column col-10  align-self-center"} style={{fontSize: "1rem"}}>{props.id + '.' + props.title} {isActive ? "▲":"▼"}</h1>
                    <h1 className={`d-flex flex-column col-2 text-end ${isCompleted ? "text-success": "text-danger"} align-self-center`} style={{fontSize: "1rem"}}>{isCompleted ? "+" : "!"}</h1>
                </div>
         <div className={`d-flex flex-row flex-wrap justify-content-center  p-3 ${isActive ? ' ': 'visually-hidden'}`}>
                    {React.Children.map(props.children, (child, index) => {
                        // Dodaj nową właściwość do każdego dziecka
                        // @ts-ignore
                        return React.cloneElement(child, {form:props.form });
                    })}
                </div>
            </div>
    )
}

export default FormSection