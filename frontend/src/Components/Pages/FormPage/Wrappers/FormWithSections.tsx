import React from "react";


type Props = {
    form: any,
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[],
    sections: any,
    readonly?: boolean
}


function FormWithSections(props: Props){

    return (
        <form>
            {/*{React.Children.map(props.children, (child, index) => {*/}
            {/*    // Dodaj nową właściwość do każdego dziecka*/}
            {/*    // @ts-ignore*/}
            {/*    return React.cloneElement(child, { id: index + 1, form: props.form, sections:props.sections, readonly:props.readonly });*/}
            {/*})}*/}
            {props.children}
        </form>
    )
}


export default FormWithSections