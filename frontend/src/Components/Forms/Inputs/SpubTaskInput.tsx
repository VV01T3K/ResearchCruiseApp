import React, {useEffect, useRef} from "react";
import {Controller, get, useFieldArray} from "react-hook-form";
import ErrorCode from "../../LoginPage/ErrorCode";
import {register} from "../../../serviceWorkerRegistration";
import Select from "react-select";
import {administrationUnits} from "../../../resources/administrationUnits";
import {ButtonGroup, Dropdown} from "react-bootstrap";
import Style from "./TaskInput/TaskInput.module.css";
import InputWrapper from "./InputWrapper";


type SpubTask = {
    yearFrom: string,
    yearTo: string,
    name: string
}

type Props = {
    className: string,
    name: string,
    form?,
    historicalSpubTasks: SpubTask[]
}


export default function SpubTaskInput(props: Props){
    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control: props.form.control,
        name: props.name,
    });

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

    return (
        <>
        <div className={props.className + " p-3 d-flex flex-column justify-content-center"}>
            <table className="table-stripe w-100">
                <thead className="text-white text-center" style={{"backgroundColor":"#052d73"}}>
                    <tr className="d-flex flex-row center align-items-center w-100">
                        <td className="text-center p-2 w-100">
                            Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie
                        </td>
                    </tr>
                </thead>

                <tbody>
                    {!fields.length &&
                        <tr className="d-flex flex-row bg-light p-2 justify-content-center">
                            <td colSpan={3} className="text-center w-100" >Brak</td>
                        </tr>
                    }
                    {fields.length > 0 &&
                        <tr className="d-flex flex-row justify-content-center align-items-center border bg-light">
                            <td className="text-center p-2" style={{"width": "5%"}}>Lp.</td>
                            <td className="text-center p-2" style={{"width": "15%"}}>Rok rozpoczęcia</td>
                            <td className="text-center p-2" style={{"width": "15%"}}>Rok zakończenia</td>
                            <td className="text-center p-2" style={{"width": "60%"}}>Nazwa</td>
                            <td className="text-center p-2" style={{"width": "5%"}}></td>
                        </tr>
                    }
                    {fields.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <tr className="d-flex flex-row justify-content-center align-items-center border bg-light">
                                <td className="text-center p-2" style={{"width": "5%"}}>{index + 1}.</td>
                                <td className="text-center p-2" style={{"width": "15%"}}>
                                    <Controller name={`${props.name}[${index}].value.yearFrom`}
                                                control={props.form.control}
                                                rules={{
                                                    required: "Pole nie może być puste"
                                                }}
                                                render={({ field }) => (
                                                    <input {...field}
                                                           type="number"
                                                           min="1900"
                                                           max="2100"
                                                           className="w-100"
                                                    />
                                                )}
                                    />
                                </td>
                                <td className="text-center p-2" style={{"width": "15%"}}>
                                    <Controller name={`${props.name}[${index}].value.yearTo`}
                                                control={props.form.control}
                                                rules={{
                                                    required: "Pole nie może być puste",
                                                    validate: value =>
                                                        false || "Błąd!"
                                                }}
                                                render={({ field }) => (
                                                    <input {...field}
                                                           type="number"
                                                           min="1900"
                                                           max="2100"
                                                           className="w-100"
                                                    />
                                                )}
                                    />
                                </td>
                                <td className="text-center p-2" style={{"width": "60%"}}>
                                    <Controller name={`${props.name}[${index}].value.name`}
                                                control={props.form.control}
                                                rules={{
                                                    required: "Pole nie może być puste"
                                                }}
                                                render={({ field }) => (
                                                    <textarea {...field}
                                                           className="w-100"
                                                    />
                                                )}
                                    />
                                </td>
                                <td className="d-inline-flex p-2" style={{"width": "5%"}}>
                                    <button type="button"
                                            className="btn btn-primary"
                                            onClick={() => {remove(index)}}
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>
                            {
                                props.form.formState.errors[props.name] &&
                                props.form.formState.errors[props.name][index] &&
                                <tr className="bg-light">
                                    <th>
                                        <ErrorCode
                                            code={props.form.formState.errors[props.name][index]["value"].message}
                                        />
                                    </th>
                                </tr>
                            }
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="d-flex flex-row justify-content-center w-100">
                <div className="d-flex w-50 text-center p-2 justify-content-center">
                    <button
                        className={`btn btn-primary w-100
                            ${props.form.formState.errors[props.name] ? "disabled" : ""}`
                        }
                        type="button"
                        onClick={() => {
                            const newSpubTask: SpubTask = {
                                yearFrom: `${new Date().getFullYear()}`,
                                yearTo: `${new Date().getFullYear()}`,
                                name: ""
                            }
                            append({value: newSpubTask})
                        }}
                    >
                        Dodaj nowe
                    </button>
                </div>
                <Select
                    minMenuHeight={300}
                    className="d-flex w-50 text-center p-2 justify-content-center"
                    isDisabled={props.form.formState.errors[props.name]}
                    menuPlacement="auto"
                    placeholder="Dodaj z historii"
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            boxShadow: "none",
                            border: "1px solid grey",
                            width: "100%"
                        }),
                        placeholder: (provided: any) => ({
                            ...provided,
                            textAlign: "center"
                        }),
                        input: (provided: any) => ({
                            ...provided
                        }),
                        menu: provided => ({
                            ...provided,
                            zIndex: 9999
                        })
                    }}
                    placeHolder={"Wybierz"}
                    options ={props.historicalSpubTasks.map((spubTask: SpubTask) => ({
                        label: `${spubTask.name} (${spubTask.yearFrom}–${spubTask.yearTo})`,
                        value: spubTask
                    }))}
                    value={""}
                    onChange={(selectedOption: { label: string, value: SpubTask })=> {
                        if (selectedOption) {
                            const newSpubTask: SpubTask = {
                                yearFrom: `${selectedOption.value.yearFrom}`,
                                yearTo: `${selectedOption.value.yearTo}`,
                                name: `${selectedOption.value.name}`
                            }
                            append({value: newSpubTask})
                        }
                    }}
                />
                {props.form.formState.errors[props.name] &&
                    <ErrorCode code={props.form.formState.errors[props.name].message}
                    />
                }
            </div>
        </div>

        <div className={props.className + " p-3"}>
            <div className="table-striped w-100">
                <div className="text-white text-center" style={{"backgroundColor": "#052d73"}}>
                    <div className="d-flex flex-row center align-items-center">
                        <div className="text-center d-none d-xl-block p-2" style={{width: "5%"}}>Lp.</div>
                        <div className="text-center d-none d-xl-block p-2 border-start" style={{width: "15%"}}>Rok rozpoczęcia</div>
                        <div className="text-center d-none d-xl-block p-2 border-start border-end" style={{width: "15%"}}>Rok zakończenia</div>
                        <div className="text-center d-none d-xl-block p-2" style={{width: "60%"}}>Nazwa zadania</div>
                        <div className="text-center d-none d-xl-block p-2" style={{width: "5%"}} />
                    </div>
                </div>
                <div className="w-100 bg-light">
                    {!fields.length &&
                        <div className="d-flex flex-row justify-content-center bg-light p-2 ">
                            <div className="text-center">Nie wybrano żadnego zadania</div>
                        </div>
                    }
                    {fields.length > 0 &&
                        <div className="d-flex flex-row center align-items-center">
                            <div className="w-25 text-center d-none d-xl-block border-end p-2">Zadanie</div>
                            <div className="w-75 text-center d-none d-xl-block p-2">Szczegóły</div>
                            {/*<div className="d-none d-xl-inline-flex p-2">*/}
                            {/*    <ButtonGroup as={Dropdown}*/}
                            {/*                 className={"w-100 align-self-center" + Style.centeredDropdown}*/}
                            {/*    >*/}
                            {/*        <Dropdown.Toggle variant="primary">*/}
                            {/*            +*/}
                            {/*        </Dropdown.Toggle>*/}
                            {/*        <Dropdown.Menu>*/}
                            {/*            {options.map((item, index) => (*/}
                            {/*                <Dropdown.Item key={index} onClick={() => {*/}
                            {/*                    append(item[1])*/}
                            {/*                }}>*/}
                            {/*                    {item[0]}*/}
                            {/*                </Dropdown.Item>*/}
                            {/*            ))}*/}
                            {/*        </Dropdown.Menu>*/}
                            {/*    </ButtonGroup>*/}
                            {/*</div>*/}
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
        </>
    )
}
