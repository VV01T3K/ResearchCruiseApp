import {Control, Controller, FieldValues} from "react-hook-form";
import Select, {GroupBase, OptionsOrGroups} from "react-select";
import ErrorCode from "../../LoginPage/ErrorCode";
import React, {useState} from "react";

function FormSection(props: {children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[],
    title:string, id:string, completed:(string | boolean)[]}){
    return  (<>
            <div id={props.id} className={"d-flex flex-row p-3  bg-light "} >
               <h1 className={"d-flex flex-column col-6  align-self-center"} style={{fontSize: "1.5rem"}}>{props.title}</h1>
                <h1 className={`d-flex flex-column col-6 text-end ${props.completed.at(1) ? "text-success": "text-danger"} align-self-center`} style={{fontSize: "1.5rem"}}>{props.completed.at(1) ? "+" : "!"}</h1>
            </div>
            <div className={"d-flex flex-row flex-wrap justify-content-center border-2 border-black border-bottom pb-2"}>
                {props.children}
            </div>
        </>
    )
}

export default FormSection