import React from "react";


type Props = {
    form: any,
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[],
    sections: any,
}


function FormWithSections(props: Props){

    return (
        <form className="flex-grow-1 overflow-scroll justify-content-center">
            {React.Children.map(props.children, (child, index) => {
                // Dodaj nową właściwość do każdego dziecka
                // @ts-ignore
                return React.cloneElement(child, { id: index + 1, form: props.form, sections:props.sections });
            })}
        </form>
    )
}


export default FormWithSections