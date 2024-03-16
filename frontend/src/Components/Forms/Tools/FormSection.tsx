import React, {useEffect, useState} from "react";
import useCustomEvent from "../../Tools/useCustomEvent";


type Props = {
    form?: {
        formState: { dirtyFields: any; touchedFields: any; errors: any; }
        watch: () => unknown;
    },
    id?: string | undefined,
    children?:
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>[] |
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>,
    title: string,
    sections?: { [x: string]: string; }
}



function FormSection(props: Props) {
    // Check conditions for each child
    const isChildInvalid =
        (child: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>> | undefined):boolean =>{
            const required = child!.props.required ?? true
            const childName = child!.props.name;
            if (React.Children.count(child) === 0)
                return false
            return (
                (required &&(
                !(childName in props.form!.formState.dirtyFields) ||
                !(childName in props.form!.formState.touchedFields))) ||
                (childName in props.form!.formState.errors)
            )
        };

    const { dispatchEvent } = useCustomEvent('sectionStateChange');

    const [isActive, setIsActive] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false)
    const key = Object.keys(props.sections!).find((k) => props.sections![k] === props.title);

    useEffect(()=>{
        const invalidChildren = React.Children.map(props.children, (child) => {
            return isChildInvalid(child)}) as boolean[]
        const validChildren =
            !Object.values(invalidChildren).some((child)=>child)
        dispatchEvent( {[key as string]:validChildren})
        setIsCompleted(validChildren)

    },[props.form!.watch()])



    return  (
        <div className="accordion-item border-2 border-black border-bottom">
            <div onClick={() => setIsActive(!isActive)}
                 id={props.id}
                 className={"accordion-title d-flex flex-row p-3 bg-light sticky-top z-2"}
                 style={{cursor:"pointer"}}
            >
                <h1 className={"d-flex flex-column col-10 align-self-center"} style={{fontSize: "1rem"}}>
                    {props.id + '. ' + props.title} {isActive ? "▲" : "▼"}
                </h1>
                <h1 className={
                        `d-flex flex-column col-2 text-end ${isCompleted ? "text-success" : "text-danger"}
                        align-self-center`
                    }
                    style={{fontSize: "1rem"}}
                >
                    {isCompleted ? "+" : "!"}
                </h1>
            </div>
            <div className={
                    `d-flex flex-row flex-wrap justify-content-center p-3 ${isActive ? ' ' : 'visually-hidden'}`
                }
            >
                {React.Children.map(props.children, (child, index) => {
                    return React.cloneElement(child as React.ReactElement, {form: props.form});
                })}
            </div>
        </div>
    )
}


export default FormSection