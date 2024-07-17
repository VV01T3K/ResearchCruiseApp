import React, { useEffect, useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../CommonComponents/ErrorCode";
import Select from "react-select";

import DatePicker  from 'react-datepicker';

export type Action = {
    startDate: string,
    endDate: string,
    name: string,
    insurance: boolean,
    permission:boolean
}

type Props = {
    className: string,
    name: string,
    form?: UseFormReturn,
    history?: Action[],
    required?: boolean,
    readonly?:boolean, }


export default function EquipmentInput(props: Props){
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

                                        return !row.name || (row.insurance && !(row.startDate && row.endDate))
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
                                                style={{width: "35%"}}>
                                                <b>Nazwa sprzętu/aparatury</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "11%"}}>
                                                <b>Zgłoszenie do ubezpieczenia</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "15%"}}>
                                                <b>Od</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "15%"}}>
                                                <b>Do</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "14%"}}>
                                                <b>Czy uzyskano zgodę opiekuna</b>
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
                                            <div className="text-center">Nie dodano żadnego sprzętu/aparatury</div>
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
                                                    style={{width: windowWidth >= 1200 ? "35%" : "100%"}}
                                                >
                                                    <div
                                                        className="col-12 d-flex d-xl-none justify-content-center">Nazwa
                                                        sprzętu/aparatury
                                                    </div>
                                                    <textarea
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        value={row.name}
                                                        onChange={(e) => {
                                                            row.name = e.target.value
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
                                                        className="col-12 p-1 form-control"
                                                        style={{fontSize: "inherit", resize: "none"}}
                                                        rows={2}

                                                    />
                                                </div>
                                                <div
                                                    className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                    style={{width: windowWidth >= 1200 ? "11%" : "100%"}}
                                                >
                                                    <div className="col-12 d-flex d-xl-none justify-content-center">Zgłoszenie do ubezpieczenia
                                                    </div>
                                                <input type={"checkbox"}
                                                       {...field}
                                                       disabled={props.readonly ?? false}
                                                       checked={row.insurance}
                                                       onChange={(e) => {
                                                           row.insurance = e.target.checked
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
                                                    style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                                                >
                                                    { row.insurance && <>
                                                    <div
                                                        className="col-12 d-flex d-xl-none justify-content-center">Od
                                                    </div>
                                                    <DatePicker
                                                        {...field}
                                                        disabled={props.readonly ?? false}

                                                        //  onBlur = {()=>{if(getFieldValue(field, index, item, t).startDate)field.onBlur()}}
                                                        showYearDropdown
                                                        showTimeSelect
                                                        className={"text-center w-100 rounded-1 p-1"}
                                                        style={{fontSize: "inherit"}}
                                                        selectsStart
                                                        startDate={row.startDate ? new Date(row.startDate) : null}
                                                        maxDate={row.endDate ? new Date(row.endDate) : null}
                                                        endDate={row.endDate ? new Date(row.endDate) : null}
                                                        locale={"pl"}

                                                        selected={row.startDate ? new Date(row.startDate) : null}
                                                        onChange={(e: Date) => {
                                                            if (e != null) {
                                                                const tmp = row;
                                                                tmp["startDate"] = e.toISOString();
                                                                props.form!.setValue(
                                                                    props.name,
                                                                    field.value,
                                                                    {
                                                                        shouldTouch: true,
                                                                        shouldValidate: true,
                                                                        shouldDirty: true
                                                                    }
                                                                )
                                                                // handleChange(field, row, rowIndex, valIdx, tmp)
                                                            }
                                                        }}
                                                        // getPopupContainer={trigger => trigger.parentElement}
                                                        dateFormat="dd/MM/yyyy HH:mm"
                                                    />
                                                    </>
                                                }
                                                    { !row.insurance && <>nd.</>}
                                                </div>
                                                <div
                                                    className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                    style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                                                >
                                                    { row.insurance && <>
                                                    <div
                                                        className="col-12 d-flex d-xl-none justify-content-center">Do
                                                    </div>
                                                    <DatePicker
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        // onBlur = {()=>{if(getFieldValue(field, index, item, t).endDate)field.onBlur()}}
                                                        showYearDropdown
                                                        showTimeSelect
                                                        className={"text-center w-100 rounded-1 p-1"}
                                                        style={{fontSize: "inherit"}}
                                                        startDate={row.startDate ? new Date(row.startDate) : null}
                                                        endDate={row.endDate ? new Date(row.endDate) : null}
                                                        minDate={row.startDate ? new Date(row.startDate) : null}
                                                        selectsEnd
                                                        locale={"pl"}
                                                        selected={row.endDate ? new Date(row.endDate) : null}
                                                        onChange={(e: Date) => {
                                                            if (e != null) {
                                                                const tmp = row;
                                                                tmp["endDate"] = e.toISOString();
                                                                props.form!.setValue(
                                                                    props.name,
                                                                    field.value,
                                                                    {
                                                                        shouldTouch: true,
                                                                        shouldValidate: true,
                                                                        shouldDirty: true
                                                                    }
                                                                )
                                                            }
                                                        }}
                                                        // getPopupContainer={trigger => trigger.parentElement}
                                                        dateFormat="dd/MM/yyyy HH:mm"
                                                    />
                                                    </>}
                                                    { !row.insurance && <>nd.</>}
                                                </div>
                                                <div
                                                    className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                    style={{width: windowWidth >= 1200 ? "14%" : "100%"}}
                                                >
                                                    <div
                                                        className="col-12 d-flex d-xl-none justify-content-center">Czy
                                                        uzyskano zgodę opiekuna
                                                    </div>
                                                    <input type={"checkbox"}
                                                           {...field}
                                                           disabled={props.readonly ?? false}
                                                           checked={row.permission}
                                                           onChange={(e) => {
                                                               row.permission = e.target.checked
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
