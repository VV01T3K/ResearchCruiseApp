import React, {useEffect, useRef} from "react";
import {Controller, get, useFieldArray} from "react-hook-form";
import ErrorCode from "../../LoginPage/ErrorCode";
import {register} from "../../../serviceWorkerRegistration";
import Select from "react-select";
import {administrationUnits} from "../../../resources/administrationUnits";


type SpubTask = {
    yearFrom: string,
    yearTo: string,
    name: string
}

type Props = {
    className: string,
    label: string,
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
    console.log(props.form.getValues())

    return (
        <div className={props.className + " p-3 d-flex flex-column justify-content-center"}>
            <table className="table-stripe w-100">
                <thead className="text-white text-center" style={{"backgroundColor":"#052d73"}}>
                    <tr className="d-flex flex-row center align-items-center w-100">
                        <td className="text-center p-2 w-100">{props.label}</td>
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
    )
}
