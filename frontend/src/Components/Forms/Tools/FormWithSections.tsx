import React from "react";

function FormWithSections(props:{children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[], onChange, onSubmit}){

    return(
        <form className={" flex-grow-1 overflow-auto justify-content-center"} onChange={props.onChange} onSubmit={props.onSubmit}>
            {props.children}
        </form>
    )
}

export default FormWithSections