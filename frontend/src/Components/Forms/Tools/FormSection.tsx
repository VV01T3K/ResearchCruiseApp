import React, {useEffect, useState} from "react";

function FormSection(props: {form, id?: string | undefined, children?: React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>[] | React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>,
    title:string}){

    // Sprawdź warunki dla każdego dziecka
    const isChildInvalid = (childName) => {
        // return false

        return props.form.formState.dirtyFields[childName] !== undefined && props.form.formState.errors[childName];
    };




    const [isActive, setIsActive] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(()=>{
        // Użyj React.Children.map do mapowania dzieci
        const validChildren =
            !Object.values(React.Children.map(props.children, (child) => {
                const childName = child.props.name; // Przyjmuję, że pola mają atrybut "name"
                return isChildInvalid(childName)})).some((child)=>child==false)
        // }));

        // setIsCompleted(validChildren)
        // console.log(React.Children.map(props.children, (child) => {
        //     const childName = child.props.name; // Przyjmuję, że pola mają atrybut "name"
        //     return isChildInvalid(childName)}))
        setIsCompleted(validChildren)
    },[props.form.watch()])


    return  (<div className="accordion-item border-2 border-black border-bottom">
                <div onClick={() => setIsActive(!isActive)} id={props.id} className={" accordion-title d-flex flex-row p-3  bg-light sticky-top z-2 "} >
                   <h1 className={"d-flex flex-column col-10  align-self-center"} style={{fontSize: "1rem"}}>{props.id + '.' + props.title} {isActive ? "▲":"▼"}</h1>
                    <h1 className={`d-flex flex-column col-2 text-end ${isCompleted ? "text-success": "text-danger"} align-self-center`} style={{fontSize: "1rem"}}>{isCompleted ? "+" : "!"}</h1>
                </div>
         <div className={`d-flex flex-row flex-wrap justify-content-center  p-3 ${isActive ? ' ': 'visually-hidden'}`}>
                    {React.Children.map(props.children, (child, index) => {
                        // Dodaj nową właściwość do każdego dziecka
                        return React.cloneElement(child, {form:props.form });
                    })}
                </div>
            </div>
    )
}

export default FormSection