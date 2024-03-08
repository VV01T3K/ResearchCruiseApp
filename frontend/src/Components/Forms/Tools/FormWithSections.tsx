import React from "react";


type Props = {
    form,
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[],
    onChange,
    onSubmit,
    sections,
}


function FormWithSections(props: Props){

    return (
        <form className="flex-grow-1 overflow-auto justify-content-center"
              onChange={props.onChange}
              onSubmit={props.onSubmit}
        >
            {React.Children.map(props.children, (child, index) => {
                // Dodaj nową właściwość do każdego dziecka
                return React.cloneElement(child, { id: index + 1, form: props.form, sections:props.sections });
            })}
        </form>
    )
}


export default FormWithSections