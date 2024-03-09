import React, {useEffect, useRef} from "react";
import {Controller, get, useFieldArray} from "react-hook-form";
import ErrorCode from "../../LoginPage/ErrorCode";


type Props = {
    className: string,
    label: string,
    name: string,
    form?
}

type SpubTask = {
    yearFrom: number,
    yearTo: number,
    name: string
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
                        <td className="text-center p-2" style={{"width": "5%", "height": "100%"}}>Lp.</td>
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
                                                       defaultValue={`${new Date().getFullYear()}`}
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
                                                // validate: value =>
                                                //     value >= props.form.getValues(props.name)[index].value.yearFrom ||
                                                //         "Rok zakończenia nie może być wcześniejszy niż rok rozpoczęcia"
                                            }}
                                            render={({ field }) => (
                                                <input {...field}
                                                       type="number"
                                                       min="1900"
                                                       max="2100"
                                                       defaultValue={`${new Date().getFullYear()}`}
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
                                                <input {...field}
                                                       type="text"
                                                       className="w-100"
                                                       defaultValue=""
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
                        <tr className="bg-light">
                            {props.form.formState.errors[props.name] &&
                                props.form.formState.errors[props.name][index] &&
                                <th>
                                    <ErrorCode
                                            code={props.form.formState.errors[props.name][index]["value"].message}
                                        />
                                </th>
                            }
                        </tr>
                    </React.Fragment>
                ))}
                </tbody>
            </table>

            <div className="d-flex flex-row justify-content-center w-100">
                <div className="d-flex col-6 text-center p-2 justify-content-center">
                    <button className={`btn btn-primary ${props.form.formState.errors[props.name] ? "disabled" : ""} w-100`}
                            type="button"
                            onClick={append}
                    >
                        Dodaj nowe
                    </button>
                </div>
                <div className="d-flex col-6 text-center p-2 justify-content-center">
                    <button className={`btn btn-primary ${props.form.formState.errors[props.name] ? "disabled" : ""} w-100`}
                            type="button"
                            onClick={() => {

                            }}
                    >
                        Dodaj z historii
                    </button>
                </div>
            </div>
        </div>
    )
}
