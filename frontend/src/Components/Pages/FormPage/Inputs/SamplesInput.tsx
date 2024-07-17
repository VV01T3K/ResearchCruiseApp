import React, { useEffect, useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../CommonComponents/ErrorCode";
import Select from "react-select";

import DatePicker  from 'react-datepicker';

export type Action = {
    material: string,
    amount: string,
    analysis: string,
    check: string,
    solution: string
}

type Props = {
    className: string,
    name: string,
    form?: UseFormReturn,
    history?: Action[],
    required?: boolean,
    readonly?:boolean, }


export default function SamplesInput(props: Props){
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(
        () => {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        },
        []
    );
    const disabled = props.form!.formState.errors[props.name]?.type =="noEmptyRowFields"

    return (
        <div className={props.className + " p-3"}>
            <Controller name={props.name}
                        control={props.form!.control}
                        defaultValue={[]}
                        rules = {{
                            required: true,
                            validate: {
                                noEmptyRowFields: (value: Action[]) => {
                                    if (value.some((row: Action) => {

                                        return !row.material || (row.check && !(row.solution))
                                        // .some(rowField => !rowField)
                                    })
                                    )
                                        return "Wypełnij wszystkie pola"
                                },
                            }
                        }}
                        render={({ field}) => (
                            <>
                                <div className="table-striped w-100">


                                    <div className="text-white text-center bg-primary">
                                        <div className="d-flex flex-row center">
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "5%"}}>
                                                <b>Lp.</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "23%"}}>
                                                <b>Rodzaj materiału badawczego / próbek / danych</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "10%"}}>
                                                <b>Ilość/Liczba</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "24%"}}>
                                                <b>Analizy na zebranym materiale badawczym</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "10%"}}>
                                                <b>Czy dane upubliczniono</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "23%"}}>
                                                <b>W jaki sposób</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2"
                                                style={{width: "5%"}}/>

                                            <div className="d-flex justify-content-center d-xl-none p-2 col-12">
                                                <b>y</b>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-100 bg-light">
                                        {!field.value.length &&
                                            <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                                                <div className="text-center">Nie dodano żadnego materiału badawczego</div>
                                            </div>
                                        }
                                        {field.value.map((row: Action, index: number) => (
                                            <div key={index}
                                                 className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                                            >
                                                <div
                                                    className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                    style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                                >
                                                    {index + 1}.
                                                </div>
                                                <div
                                                    className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                                    <b> {index + 1}.</b>
                                                </div>

                                                <div
                                                    className="d-flex flex-wrap justify-content-center align-items-center border-end p-2"
                                                    style={{width: windowWidth >= 1200 ? "23%" : "100%"}}
                                                >
                                                    <div
                                                        className="col-12 d-flex d-xl-none justify-content-center">Rodzaj materiału badawczego / próbek / danych
                                                    </div>
                                                    <textarea
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        value={row.material}
                                                        className="col-12 p-1 form-control"
                                                        style={{fontSize: "inherit"}}
                                                        onChange={(e) => {
                                                            if (e.target.value.length < 100) {
                                                                row.material = e.target.value
                                                                props.form!.setValue(
                                                                    props.name,
                                                                    field.value,
                                                                    {
                                                                        shouldDirty: true,
                                                                        shouldTouch: true,
                                                                        shouldValidate: true
                                                                    }
                                                                )
                                                                field.onChange(field.value)
                                                            }
                                                        }}
                                                        rows={2}
                                                    />
                                                </div>
                                                <div
                                                    className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                    style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                                                >
                                                    <div
                                                        className="col-12 d-flex d-xl-none justify-content-center">Ilość/Liczba
                                                    </div>
                                                    <input
                                                        disabled={props.readonly ?? false}
                                                        type="text"
                                                        {...field}
                                                        className="text-center placeholder-glow w-100 p-1 form-control"
                                                        style={{fontSize: "inherit"}}
                                                        value={row.amount}
                                                        onChange={(e) => {
                                                            const sanitizedValue = parseInt(e.target.value);
                                                            var val = field.value;
                                                            console.log(sanitizedValue)
                                                            if (!isNaN(sanitizedValue) && sanitizedValue < 9999) {
                                                                val[index].amount = sanitizedValue
                                                            } else {
                                                                val[index].amount = '0'
                                                            }
                                                            props.form!.setValue(props.name, val, {
                                                                shouldDirty: true,
                                                                shouldTouch: true,
                                                                shouldValidate: true
                                                            })
                                                            field.onChange(val)
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                    style={{width: windowWidth >= 1200 ? "24%" : "100%"}}
                                                >

                                                    <div
                                                        className="col-12 d-flex d-xl-none justify-content-center">Analizy na zebranym materiale badawczym
                                                    </div>
                                                    <textarea
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        value={row.analysis}
                                                        className="col-12 p-1 form-control"
                                                        style={{fontSize: "inherit"}}
                                                        onChange={(e) => {
                                                            if (e.target.value.length < 100) {
                                                                row.analysis = e.target.value
                                                                props.form!.setValue(
                                                                    props.name,
                                                                    field.value,
                                                                    {
                                                                        shouldDirty: true,
                                                                        shouldTouch: true,
                                                                        shouldValidate: true
                                                                    }
                                                                )
                                                                field.onChange(field.value)
                                                            }
                                                        }}
                                                        rows={3}
                                                    />
                                                </div>
                                                <div
                                                    className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                    style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                                                >

                                                    <div
                                                        className="col-12 d-flex d-xl-none justify-content-center">Czy dane upubliczniono
                                                    </div>
                                                    <input type={"checkbox"}
                                                           {...field}
                                                           disabled={props.readonly ?? false}
                                                           checked={row.check}
                                                           onChange={(e) => {
                                                               row.check = e.target.checked
                                                               props.form?.setValue(
                                                                   props.name,
                                                                   field.value,
                                                                   {
                                                                       shouldTouch: true,
                                                                       shouldValidate: true,
                                                                       shouldDirty: true
                                                                   }
                                                               )
                                                               field.onChange(field.value)
                                                           }}
                                                           className="w-50 h-50"
                                                           style={{fontSize: "inherit", resize: "none"}}/>
                                                </div>
                                                <div
                                                    className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                    style={{width: windowWidth >= 1200 ? "23%" : "100%"}}
                                                >
                                                    { row.check && <>
                                                    <div
                                                        className="col-12 d-flex d-xl-none justify-content-center">W jaki sposób
                                                    </div>
                                                    <textarea
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        value={row.solution}
                                                        className="col-12 p-1 form-control"
                                                        style={{fontSize: "inherit"}}
                                                        onChange={(e) => {
                                                            if (e.target.value.length < 100) {
                                                                row.solution = e.target.value
                                                                props.form!.setValue(
                                                                    props.name,
                                                                    field.value,
                                                                    {
                                                                        shouldDirty: true,
                                                                        shouldTouch: true,
                                                                        shouldValidate: true
                                                                    }
                                                                )
                                                                field.onChange(field.value)
                                                            }
                                                        }}
                                                        rows={3}
                                                    />
                                                    </>
                                                    }
                                                    { !row.check && <>nd.</>}
                                                    </div>
                                                        <div className="d-flex justify-content-center align-items-center p-2"
                                                        style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                                >
                                                    <button type="button"
                                                            style={{fontSize: "inherit"}}
                                                            className={`btn btn-info ${props.readonly ? 'd-none' : ''}`}
                                                            onClick={() => {
                                                                const val: Action[] = field.value;

                                                                val.splice(index, 1)
                                                                props.form!.setValue(
                                                                    props.name,
                                                                    val,
                                                                    {
                                                                        shouldValidate: true,
                                                                        shouldDirty: true,
                                                                        shouldTouch: true
                                                                    }
                                                                )
                                                            }}
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div
                                    className={`d-flex flex-row flex-wrap justify-content-center w-100 ${props.readonly ? 'd-none' : ''}`}>
                                    <div
                                        className="d-flex col-12  text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                                        <button
                                            style={{fontSize: "inherit"}}
                                            className={`btn btn-info w-100
                                                ${disabled ? "disabled" : ""}`
                                            }
                                            type="button"
                                            onClick={() => {
                                                const newAction: Action = {
                                                    startDate: "",
                                                    endDate: "",
                                                    name: "",
                                                    permission:false,
                                                    insurance:false
                                                }
                                                props.form!.setValue(
                                                    props.name,
                                                    [...field.value, newAction],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true
                                                    }
                                                )
                                                field.onChange([...field.value, newAction])
                                            }}
                                        >
                                            Dodaj
                                        </button>
                                    </div>
                                    {props.form!.formState.errors[props.name] &&
                                        <ErrorCode code={props.form!.formState.errors[props.name]!.message} />
                                    }
                                </div>
                            </>
                        )}
            />
        </div>
    )
}
