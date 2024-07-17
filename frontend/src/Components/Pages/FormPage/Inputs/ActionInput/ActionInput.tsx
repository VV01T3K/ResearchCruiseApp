import React, { useEffect, useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../../CommonComponents/ErrorCode";
import Select from "react-select";

import DatePicker  from 'react-datepicker';

export type Action = {
    startDate: string,
    endDate: string,
    name: string
}

type Props = {
    className: string,
    name: string,
    form?: UseFormReturn,
    history?: Action[],
    required?: boolean,
    readonly?:boolean,
    actionName:string
}


export default function ActionInput(props: Props){
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
    console.log(props.form!.formState.errors[props.name])
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
                                        return Object
                                            .values(row)
                                            .some(rowField => !rowField)
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
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "5%"}}>
                                                <b>Lp.</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "25%"}}>
                                                <b>Od</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "25%"}}>
                                                <b>Do</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "40%"}}>
                                                <b>Nazwa {props.actionName.toLowerCase()}u</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "5%"}} />

                                            <div className="d-flex justify-content-center d-xl-none p-2 col-12">
                                                <b>{props.actionName}y</b>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-100 bg-light">
                                        {!field.value.length &&
                                            <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                                                <div className="text-center">Nie dodano żadnego {props.actionName.toLowerCase()}u</div>
                                            </div>
                                        }
                                        {field.value.map((row: Action, index: number) => (
                                            <div key={index}
                                                 className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                                            >
                                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                     style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                                >
                                                    {index + 1}.
                                                </div>
                                                <div className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                                    <b>{props.actionName} {index + 1}.</b>
                                                </div>

                                                <div className="d-flex flex-wrap justify-content-center align-items-center border-end p-2"
                                                     style={{width: windowWidth >= 1200 ? "25%" : "100%"}}
                                                >
                                                    <div className="col-12 d-flex d-xl-none justify-content-center">Od</div>
                                                    <DatePicker
                                                        {...field}
                                                        disabled={props.readonly ?? false}

                                                        //  onBlur = {()=>{if(getFieldValue(field, index, item, t).startDate)field.onBlur()}}
                                                        showMonthYearPicker
                                                        showMonthYearDropdown
                                                        className={"text-center w-100 border border-opacity-75 rounded-2 p-1"}
                                                        selectsStart
                                                        startDate={row.startDate ? new Date(row.startDate) : null}
                                                        maxDate={row.endDate ? new Date(row.endDate) : null}
                                                        endDate={row.endDate ? new Date(row.endDate) : null}
                                                        locale={"pl"}
                                                        showTimeSelect
                                                        selected={row.startDate ? new Date(row.startDate) : null}
                                                        onChange={(e: Date)=> {
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
                                                </div>
                                                <div className="d-flex flex-wrap ustify-content-center align-items-center p-2 border-end"
                                                     style={{width: windowWidth >= 1200 ? "25%" : "100%"}}
                                                >
                                                    <div className="col-12 d-flex d-xl-none justify-content-center">Do</div>
                                                    <DatePicker
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        // onBlur = {()=>{if(getFieldValue(field, index, item, t).endDate)field.onBlur()}}
                                                        showYearDropdown
                                                        showTimeSelect
                                                        className={"text-center w-100 border border-opacity-75 rounded-2 p-1"}
                                                        startDate={row.startDate ? new Date(row.startDate) : null}
                                                        endDate={row.endDate ? new Date(row.endDate) : null}
                                                        minDate={row.startDate ? new Date(row.startDate) : null}
                                                        selectsEnd
                                                        locale={"pl"}
                                                        selected={row.endDate ? new Date(row.endDate) : null}
                                                        onChange={(e: Date)=> {
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
                                                </div>
                                                <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                     style={{width: windowWidth >= 1200 ? "40%" : "100%"}}
                                                >
                                                    <div className="col-12 d-flex d-xl-none justify-content-center">Nazwa {props.actionName.toLowerCase()}u</div>
                                                    <textarea
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        value={row.name}
                                                        onChange = {(e)=> {
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
                                                        style={{fontSize: "inherit", resize:"none"}}
                                                        rows={2}

                                                    />
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center p-2"
                                                     style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                                >
                                                    <button type="button"
                                                            style={{fontSize:"inherit"}}
                                                            className={`btn btn-info ${props.readonly ? 'd-none':''}`}
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

                                <div className={`d-flex flex-row flex-wrap justify-content-center w-100 ${props.readonly ? 'd-none':''}`}>
                                    <div className="d-flex col-12 col-xl-6 text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                                        <button
                                            style={{fontSize: "inherit"}}
                                            className={`btn btn-info w-100
                                                ${ disabled ? "disabled" : ""}`
                                            }
                                            type="button"
                                            onClick={() => {
                                                const newAction: Action = {
                                                    startDate: "",
                                                    endDate: "",
                                                    name: ""
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
                                    <Select
                                        minMenuHeight={300}
                                        className="d-flex col-12 col-xl-6 text-start pt-1 pb-2 pt-xl-2 ps-xl-2 pb-xl-2"
                                        isDisabled={disabled}
                                        menuPlacement="auto"
                                        placeholder="Dodaj z historii"
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                boxShadow: "none",
                                                border: "1px solid grey",
                                                width: "100%",
                                                cursor: "pointer"
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
                                        options ={
                                            props.history ? props.history.map((action: Action) => ({
                                                label: `${action.name} (${action.startDate}–${action.endDate})`,
                                                value: action
                                            })): []
                                        }
                                        value={""}
                                        onChange={(selectedOption: { label: string, value: Action })=> {
                                            if (selectedOption) {
                                                props.form!.setValue(
                                                    props.name,
                                                    [...field.value, selectedOption.value],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                        shouldTouch: true
                                                    }
                                                )
                                                field.onChange([...field.value, selectedOption.value])
                                            }
                                        }}
                                    />
                                    {props.form!.formState.errors[props.name] &&
                                        <ErrorCode code={props.form!.formState.errors[props.name].message} />
                                    }
                                </div>
                            </>
                        )}
            />
        </div>
    )
}
