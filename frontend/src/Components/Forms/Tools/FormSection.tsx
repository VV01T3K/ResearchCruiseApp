import React, {useEffect, useState} from "react";
import useCustomEvent from "../../Tools/useCustomEvent";


type Props = {
    form?: {
        formState: {
            dirtyFields: { [x: string]: undefined; };
            errors: { [x: string]: any; };
        };
        watch: () => unknown;
    },
    id?: string | undefined,
    children?:
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>[] |
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>,
    title: string
}

// const { dispatchEvent } = useCustomEvent('sectionStateChange');


function FormSection(props: Props) {
    // Check conditions for each child
    const isChildInvalid =
        (child: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>> | undefined):boolean =>{
            const required = child!.props.required ?? true
            const childName = child!.props.name;
            if (!required || React.Children.count(child) === 0)
                return false
            console.log(props.form!.formState.dirtyFields)
            return !(
                required &&
                childName in props.form!.formState.dirtyFields &&
                !(childName in props.form!.formState.errors)
            );
        };

    const { dispatchEvent } = useCustomEvent('sectionStateChange');

    const [isActive, setIsActive] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(()=>{
        const invalidChildren = React.Children.map(props.children, (child) => {
            return isChildInvalid(child)}) as boolean[]
        const validChildren =
            !Object.values(invalidChildren).some((child)=>child)
        // dispatchEvent( {[props.title]:validChildren})
        setIsCompleted(validChildren)

    },[props.form!.watch()])



    return  (<div className="accordion-item border-2 border-black border-bottom">
                <div onClick={() => setIsActive(!isActive)} id={props.id} className={" accordion-title d-flex flex-row p-3  bg-light sticky-top z-2 "} >
                   <h1 className={"d-flex flex-column col-10  align-self-center"} style={{fontSize: "1rem"}}>{props.id + '.' + props.title} {isActive ? "▲":"▼"}</h1>
                    <h1 className={`d-flex flex-column col-2 text-end ${isCompleted ? "text-success": "text-danger"} align-self-center`} style={{fontSize: "1rem"}}>{isCompleted ? "+" : "!"}</h1>
                </div>
         <div className={`d-flex flex-row flex-wrap justify-content-center  p-3 ${isActive ? ' ': 'visually-hidden'}`}>

                    {React.Children.map(props.children, (child, index) => {
                        return React.cloneElement(child as React.ReactElement, {form: props.form});
                    })}
            </div>
        </div>
    )
}


export default FormSection