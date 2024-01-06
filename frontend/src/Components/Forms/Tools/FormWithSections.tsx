import React from "react";

function FormWithSections(props:{children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[], onChange}){

    return(
        <form className={" flex-grow-1 overflow-auto justify-content-center"} onChange={props.onChange}>
            {props.children}
        </form>
    )
}

export default FormWithSections