import React, {useEffect, useState} from "react";
import {useFieldArray} from "react-hook-form";

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {isVisible} from "@testing-library/user-event/dist/utils";

const options = [
    'one', 'two', 'three'
];
const defaultOption = options[0];

function TaskInput(props:{className:string, label:string, control}) {
    const { fields, append, remove } = useFieldArray({
        control: props.control,
        name: 'subformItems',
    });

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const onScroll = ()=>setIsOpen(false)
        document.body.addEventListener('scroll', onScroll);
        return () => document.body.removeEventListener("scroll", onScroll);
    },[isOpen]);

    return (
        <div className={props.className + "  p-3"}>
            <label>{props.label}</label>
            <table className="table-striped w-100">
                <thead className={" text-white text-center"} style={{"backgroundColor":"#052d73"}}>
                <tr className={"d-flex flex-row center align-items-center"}>
                    <th className={"w-25 text-center p-2"}>Zadanie</th>
                    <th className={"w-75 text-center p-2"}>Szczegóły</th>
                    <th className={"d-inline-flex p-2"}>
                        <div className="dropdown">
                            <button onClick={()=>setIsOpen(!isOpen)} className="btn btn-outline-light dropdown-toggle"zq type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                +
                            </button>

                            <div className={`dropdown-menu ${isOpen ? "show":""}`} aria-labelledby="dropdownMenuButton">
                                <button type={"button"} onClick={() => {append({ fieldName: 'field' })}} className="dropdown-item" href="/#">2019</button>
                                <button className="dropdown-item" href="/#">2020</button>
                                <button className="dropdown-item" href="/#">2021</button>
                            </div>
                        </div>
                    </th>
                </tr>{/*}//*/}
                </thead>
                <tbody className={"w-100"}>
                {!fields && <tr className={"d-flex flex-row justify-content-center  bg-light p-2 "}>
                    <th colSpan={3} className={"text-center"} >Nie wybrano żadnego zadania</th></tr>}
                        {fields && fields.map((item, index) => (
                                <tr key={item.id} className={"d-flex flex-row justify-content-center align-items-center border  bg-light "}>
                                    <th className={"w-25 text-center p-2 border-end "}>{index}</th>
                                    <th className={"w-75 text-center p-2"}>{item.fieldName}</th>
                                    <th className={"d-inline-flex p-2"}>
                                        <button type={"button"} className="btn btn-primary"
                                                onClick={() => {remove(index)}}  >-</button>
                                    </th>
                                </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
export default TaskInput