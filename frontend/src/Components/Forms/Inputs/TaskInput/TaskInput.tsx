import React, {useEffect, useState} from "react";
import {Controller, useFieldArray} from "react-hook-form";

import 'react-dropdown/style.css';
import {ButtonGroup, Dropdown} from "react-bootstrap";
import Style from "./TaskInput.module.css";
import InputWrapper from "../InputWrapper";


type Props = {
    className: string,
    label:string,
    form?,
    name: string,
}


// const defaultOption = options[0];

function TaskInput(props: Props) {
    const options = [
        ['Praca licencjacka', { type: 0, title: "", author: "" }],
        ['Praca magisterska', { type: 1, title: "", author: "" }],
        ['Praca doktorska', { type: 2, title: "", author: "" }],
        ["Przygotowanie projektu naukowego", []],
        ["Realizacja projektu krajowego (NCN, NCBiR, itp)", []],
        ["Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)", []],
        ["Realizacja projektu wewnętrznego UG", []],
        ["Realizacja innego projektu naukowego", []],
        ["Realizacja projektu komercyjnego", []],
        ["Dydaktyka", []],
        ["Realizacja własnego zadania badawczego", []],
        ["Inne zadanie", []]
    ];

    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control: props.form.control,
        name: props.name,
    });

    const [isOpen, setIsOpen] = useState(false);

    useEffect(
        () => {
            const onScroll = () => setIsOpen(false)
            document.body.addEventListener('scroll', onScroll);
            return () => document.body.removeEventListener("scroll", onScroll);
        },
        [isOpen]
    );

    return (
        <InputWrapper {...props}>
            <div className={props.className + " p-3"}>
                <label>{props.label}</label>
                <div className="table-striped w-100">
                    <div className="text-white text-center" style={{"backgroundColor": "#052d73"}}>
                        <div className="d-flex flex-row center align-items-center">
                            <div className="w-25 text-center d-none d-xl-block border-end p-2">Zadanie</div>
                            <div className="w-100 text-center d-lg-block d-xl-none p-2">Zadanie</div>
                            <div className="w-75 text-center d-none d-xl-block p-2">Szczegóły</div>
                            <div className="d-none d-xl-inline-flex p-2">
                                <ButtonGroup as={Dropdown}
                                             className={"w-100 align-self-center" + Style.centeredDropdown}
                                >
                                    {/* Dodaj klasę CSS dla dropleft */}
                                    <Dropdown.Toggle variant="primary">
                                        +
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {options.map((item, index) => (
                                            <Dropdown.Item key={index} onClick={() => { append(item[1]) }}>
                                                {item[0]}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </ButtonGroup>
                            </div>
                        </div>
                        {/*}//*/}
                    </div>
                    <div className={"w-100"}>
                        {!fields &&
                            <div className="d-flex flex-row justify-content-center bg-light p-2 ">
                                <div className="text-center">Nie wybrano żadnego zadania</div>
                            </div>
                        }
                        {fields && fields.map((item, index) => (
                            <div key={item.id}
                                 className="d-flex flex-wrap flex-row justify-content-center align-items-center border
                                 bg-light"
                            >
                                <div className="text-center d-flex  col-12 col-xl-3 justify-content-center p-2">
                                    {options[item.type][0]}
                                </div>
                                <div className="text-center d-flex col-12 col-xl-8 justify-content-center">
                                    {<div className="d-flex p-2 flex-wrap">
                                        {Object.entries(item).slice(1, -1).map((t, s) => (
                                            <div className="d-flex flex-row flex-wrap col-12 col-xl-6">
                                                <div className="col-12 col-xl-3">{t[0]}</div>
                                                <Controller name={`${props.name}[${index}].${t[0]}`}
                                                            control={props.form.control}
                                                            rules={{
                                                                required: "Pole nie może być puste",
                                                                validate: (value) =>
                                                                    value.length < 10 ||
                                                                    'Pole nie może mieć wartości 0.'
                                                            }}
                                                            render={({ field}) => (
                                                                <input {...field}
                                                                       type="text"
                                                                       className="col-12 col-xl-9"
                                                                       onBlur={(e)=> {
                                                                           props.form.setValue(
                                                                               `${props.name}[${index}].${t[0]}`,
                                                                               e.target.value,
                                                                               { shouldDirty: false }
                                                                           )
                                                                           props.form.setValue(
                                                                               `${props.name}[${index}].${t[0]}`,
                                                                               e.target.value,
                                                                               { shouldValidate: true }
                                                                           )
                                                                       }}
                                                                />
                                                            )}
                                                />
                                            </div>
                                        ))}
                                    </div>}
                                </div>
                                <div className="d-inline-flex p-2 col-12 col-xl-1 justify-content-center
                                                justify-content-xl-end"
                                >
                                    <button type="button"
                                            className="btn btn-primary"
                                            onClick={() => { remove(index) }}
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="d-inline-flex d-xl-none p-2 w-100">
                        <ButtonGroup as={Dropdown}
                                     className={"w-100 align-self-center" + Style.centeredDropdown}
                        >
                            {/* Dodaj klasę CSS dla dropleft */}
                            <Dropdown.Toggle variant="primary">
                                +
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {options.map((item, index) => (
                                    <Dropdown.Item key={index} onClick={() => { append(item[1]) }}>
                                        {item[0]}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </InputWrapper>
    )
}


export default TaskInput