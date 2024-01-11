import React, {useEffect, useRef, useState} from "react";
import {Controller, useFieldArray} from "react-hook-form";
import Dropdown from 'react-bootstrap/Dropdown'
import {ButtonGroup} from "react-bootstrap";
import Style from "./BlockList.css"
import CSSModules from "react-css-modules";

const data =  ["Katedra Biologii Morza i Biotechnologii",
    "Stacja Morska im. Profesora Krzysztofa Skóry",
"asddasds", "sadasdd"]
function BlockList(props:{className:string, label:string, control, name}) {
    const { fields, append, remove } = useFieldArray({
        control: props.control,
        name: props.name,
    });


    const disabled =  !Array.from({ length: data.length }, (_, index) => index)
        .some(item => (!fields.map((field)=>field.label)
            .includes(item)))

    return (
        <div className={props.className + "  p-3 d-flex flex-column justify-content-center"}>
            <table className="table-striped w-100">
                <thead className={" text-white text-center"} style={{"backgroundColor":"#052d73"}}>
                <tr className={"d-flex flex-row center align-items-center w-100"}>
                    <th className={"text-center p-2 w-100"}>{props.label}</th>
                </tr>
                </thead>
                <tbody>
                {!fields.length && <tr className={"d-flex flex-row bg-light p-2 justify-content-center"}>
                    <th colSpan={3} className={"text-center"} >Nie dodano żadnej jednostki</th></tr>}
                {fields.map((item, index) => (

                    <tr key={item.id} className={"d-flex flex-row justify-content-center align-items-center border  bg-light "}>
                        <th className={"w-25 text-center p-2 border-end "}>{index}</th>
                        <th className={"w-75 text-center p-2"}>
                            {data[item.value]}
                        </th>
                        <th className={"d-inline-flex p-2"}>
                            <button type={"button"} className="btn btn-primary"
                                    onClick={() => {remove(index)}}  >-</button>
                        </th>
                    </tr>

                ))}
                </tbody>
            </table>
            <ButtonGroup as={Dropdown}  className="w-100 align-self-center centered-dropdown"> {/* Dodaj klasę CSS dla dropleft */}
                <Dropdown.Toggle className={!disabled ? " " : " disabled "} disabled={disabled} variant="primary">
                    +
                </Dropdown.Toggle>
                <Dropdown.Menu >
                    {data.map((item, index)=>{
                        if(fields.map((field)=>field.value).indexOf(index) < 0)
                            return(
                                <Dropdown.Item key={index} onClick={() => {append({ value:  index })}}>{item}</Dropdown.Item>
                            )})
                    }
                </Dropdown.Menu>
            </ButtonGroup>
        </div>
    )
}
export default  CSSModules(BlockList, Style)